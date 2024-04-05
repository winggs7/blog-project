import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { FilterCategoryDto } from './dtos/filter-category.dto';
import { ListPaginate } from 'src/common/database/types/database.types';
import { wrapPagination } from 'src/common/utils/object.util';
import { CategoryResponse } from './response/category.response';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(input: CreateCategoryDto): Promise<void> {
    const find = await this.categoryModel.findOne({ name: input.name });
    if (!find) {
      throw new HttpException('CATEGORY_IN_USED', HttpStatus.BAD_REQUEST);
    }

    const createdCategory = new this.categoryModel(input);
    await createdCategory.save();
  }

  async getById(id: string): Promise<CategoryResponse> {
    const category = await this.categoryModel.findOne({ _id: id });
    if (!category) {
      throw new HttpException('CATEGORY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async getList(
    params: FilterCategoryDto,
  ): Promise<ListPaginate<CategoryResponse>> {
    const data = await this.categoryModel
      .find({ name: new RegExp(params.filter, 'i') })
      .limit(params.limit)
      .skip(params.limit * (params.page - 1))
      .sort({
        created_at: 'asc',
      })
      .exec();

    return wrapPagination<CategoryResponse>(data, data.length, params);
  }

  async update(input: UpdateCategoryDto): Promise<void> {
    await this.getById(input.id);
    await this.categoryModel.findByIdAndUpdate(input.id, input);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.categoryModel.findByIdAndDelete(id);
  }
}
