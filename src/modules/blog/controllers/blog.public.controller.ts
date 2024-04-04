import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from '../blog.service';
import { FilterBlogDto } from '../dtos/filter-blog.dto';
import { ValidateMongoId } from 'src/common/utils/validate.util';

@Controller('blogs')
@ApiTags('Blogs')
export class BlogPublicController {
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
}
