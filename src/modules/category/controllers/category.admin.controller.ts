import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../category.service';
import { FilterCategoryDto } from '../dtos/filter-category.dto';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { ValidateMongoId } from 'src/common/utils/validate.util';

@Controller('categories')
@ApiTags('Categories')
export class CategoryAdminController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getList(@Query() param: FilterCategoryDto) {
    return await this.service.getList(param);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id', ValidateMongoId) id: string) {
    return await this.service.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateCategoryDto): Promise<void> {
    return this.service.create(body);
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Body() body: UpdateCategoryDto): Promise<void> {
    return this.service.update(body);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ValidateMongoId) id: string): Promise<void> {
    return this.service.delete(id);
  }
}
