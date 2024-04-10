import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Blog, BlogDocument } from './schema/blog.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { FilterBlogDto } from './dtos/filter-blog.dto';
import { ListPaginate } from 'src/common/database/types/database.types';
import { wrapPagination } from 'src/common/utils/object.util';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { AuthUser } from 'src/auth/types/auth.type';
import { User, UserDocument } from '../user/schema/user.schema';
import { BlogResponse } from './response/blog.response';
import { plainToInstance } from 'class-transformer';
import Excel from 'exceljs';
import { Category, CategoryDocument } from '../category/schema/category.schema';
import fs from 'fs';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectQueue('import') private readonly importQueue: Queue,
    @Inject('IMPORT_SERVICE') private readonly importService: ClientProxy,
  ) {}

  async create(input: CreateBlogDto, loggedUser: AuthUser): Promise<void> {
    const createdBlog = new this.blogModel({
      ...input,
      author: loggedUser.id,
    });

    const newBlog = await createdBlog.save();
    await this.userModel.findByIdAndUpdate(loggedUser.id, {
      $push: {
        blogs: newBlog._id,
      },
    });
  }

  async getById(id: string): Promise<BlogResponse> {
    const blog = await this.blogModel
      .findOne<BlogResponse>({ _id: id })
      .populate({ path: 'category' })
      .populate({ path: 'author' });

    if (!blog) {
      throw new HttpException('BLOG_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(BlogResponse, blog, {
      excludeExtraneousValues: true,
    });
  }

  async getList(params: FilterBlogDto): Promise<ListPaginate<BlogResponse>> {
    const data = await this.blogModel
      .find({
        $or: [
          { title: new RegExp(params.filter, 'i') },
          { content: new RegExp(params.filter, 'i') },
        ],
      })
      .populate({ path: 'category', select: ['name'] })
      .limit(params.limit)
      .skip(params.limit * (params.page - 1))
      .sort({
        created_at: 'asc',
      })
      .exec();

    return wrapPagination<BlogResponse>(
      plainToInstance(BlogResponse, data, {
        excludeExtraneousValues: true,
      }),
      data.length,
      params,
    );
  }

  async update(input: UpdateBlogDto, loggedUser: AuthUser): Promise<void> {
    await this.getById(input.id);
    await this.blogModel.findByIdAndUpdate(input.id, {
      ...input,
      author: loggedUser.id,
    });
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.blogModel.findByIdAndDelete(id);
  }

  // use bullmq
  async import(file: Express.Multer.File, loggedUser: AuthUser) {
    await this.importQueue.add(
      'import-blog',
      { file, loggedUser },
      {
        removeOnComplete: true,
      },
    );
  }

  async verifyImport(jobData: {
    file: Express.Multer.File;
    loggedUser: AuthUser;
  }) {
    const { file, loggedUser } = jobData;

    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile('./uploads/' + file.filename);

    const verifyData = this._handleImportData(workbook, loggedUser);

    await this.blogModel.insertMany(verifyData).then(() => {
      fs.unlinkSync('./uploads/' + file.filename);
    });
  }

  // use rabbitmq
  async importRmb(file: Express.Multer.File, loggedUser: AuthUser) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile('./uploads/' + file.filename);

    const verifyData = await this._handleImportData(workbook, loggedUser);

    this.importService.emit(
      {
        cmd: 'import-blog',
      },
      {
        verifyData,
      },
    );
  }

  async _handleImportData(workbook: Excel.Workbook, author: AuthUser) {
    const data: CreateBlogDto[] = [];
    workbook.worksheets.forEach((sheet) => {
      const firstRow = sheet.getRow(1);
      if (!firstRow.cellCount) return;
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber == 1) return;
        const values = row.values;
        data.push({
          title: values[1],
          content: values[2],
          category: values[3],
          banner: '',
          status: 1, //TODO
        });
      });
    });

    const listCategory = await this.categoryModel
      .find()
      .where('name')
      .in(data.map((d) => d.category));

    const verifyData = data.map((data) => {
      const findCate = listCategory.find((cate) => cate.name === data.category);

      if (!findCate) {
        throw new HttpException('CATEGORY_NOT_FOUND', HttpStatus.BAD_REQUEST);
      }

      return {
        ...data,
        category: findCate['_id'].toString(),
        author: author?.id,
      };
    });

    return verifyData;
  }
}
