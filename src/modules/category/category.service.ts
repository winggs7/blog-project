import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { FilterCategoryDto } from './dtos/filter-category.dto';
import { ListPaginate } from 'src/common/database/types/database.types';
import { wrapPagination } from 'src/common/utils/object.util';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(input: CreateCategoryDto): Promise<void> {
    const createdCategory = new this.categoryModel(input);
    await createdCategory.save();
  }

  async getById(id: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id: id });
    if (!category) {
      throw new HttpException('CATEGORY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async getList(params: FilterCategoryDto): Promise<ListPaginate<Category>> {
    const data = await this.categoryModel
      .find({ name: new RegExp(params.filter, 'i') })
      .limit(+params.limit)
      .skip(+params.limit * (+params.page - 1)) //TODO parse Int
      .sort({
        created_at: 'asc',
      })
      .exec();

    return wrapPagination<Category>(data, data.length, params);
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
