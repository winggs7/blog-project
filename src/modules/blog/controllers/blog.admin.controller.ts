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
import { BlogService } from '../blog.service';
import { FilterBlogDto } from '../dtos/filter-blog.dto';
import { ValidateMongoId } from 'src/common/utils/validate.util';
import { CreateBlogDto } from '../dtos/create-blog.dto';
import { UpdateBlogDto } from '../dtos/update-blog.dto';

@Controller('blogs')
@ApiTags('Blogs')
export class BlogAdminController {
  constructor(private readonly service: BlogService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getList(@Query() param: FilterBlogDto) {
    return await this.service.getList(param);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id', ValidateMongoId) id: string) {
    return await this.service.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateBlogDto): Promise<void> {
    return this.service.create(body);
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Body() body: UpdateBlogDto): Promise<void> {
    return this.service.update(body);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ValidateMongoId) id: string): Promise<void> {
    return this.service.delete(id);
  }
}
