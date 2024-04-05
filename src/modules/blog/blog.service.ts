import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
      .populate({ path: 'category', select: ['name'] })
      .populate({ path: 'author', select: ['username', 'full_name'] });

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
      .populate({ path: 'category', select: ['name'] })
      .limit(params.limit)
      .skip(params.limit * (params.page - 1))
      .sort({
        created_at: 'asc',
      })
      .exec();

    return wrapPagination<Blog>(data, data.length, params);
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
}
