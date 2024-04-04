import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../category.service';
import { FilterCategoryDto } from '../dtos/filter-category.dto';
import { ValidateMongoId } from 'src/common/utils/validate.util';

@Controller('categories')
@ApiTags('Categories')
export class CategoryPublicController {
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
}
