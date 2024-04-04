import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Blog, BlogDocument } from './schema/blog.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBlogDto } from './dtos/create-blog.dto';
import { FilterBlogDto } from './dtos/filter-blog.dto';
import { ListPaginate } from 'src/common/database/types/database.types';
import { wrapPagination } from 'src/common/utils/object.util';
import { UpdateBlogDto } from './dtos/update-blog.dto';
import { Category, CategoryDocument } from '../category/schema/category.schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(input: CreateBlogDto): Promise<void> {
    const createdBlog = new this.blogModel(input);
    await createdBlog.save();
  }

  async getById(id: string): Promise<Blog> {
    const blog = await this.blogModel
      .findOne({ _id: id })
      .populate('category', '', this.categoryModel);
    if (!blog) {
      throw new HttpException('BLOG_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return blog;
  }

  async getList(params: FilterBlogDto): Promise<ListPaginate<Blog>> {
    const data = await this.blogModel
      .find({
        $or: [
          { title: new RegExp(params.filter, 'i') },
          { content: new RegExp(params.filter, 'i') },
        ],
      })
      .populate('category', '', this.categoryModel)
      .limit(+params.limit)
      .skip(+params.limit * (+params.page - 1)) //TODO parse Int
      .sort({
        created_at: 'asc',
      })
      .exec();

    return wrapPagination<Blog>(data, data.length, params);
  }

  async update(input: UpdateBlogDto): Promise<void> {
    await this.getById(input.id);
    await this.blogModel.findByIdAndUpdate(input.id, input);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.blogModel.findByIdAndDelete(id);
  }
}
