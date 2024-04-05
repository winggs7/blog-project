import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogService } from '../blog.service';
import { FilterBlogDto } from '../dtos/filter-blog.dto';
import { ValidateMongoId } from 'src/common/utils/validate.util';
import { CreateBlogDto } from '../dtos/create-blog.dto';
import { AuthUser } from 'src/auth/types/auth.type';
import { ReqAuthUser } from 'src/common/decorators/request.decorator';
import { UpdateBlogDto } from '../dtos/update-blog.dto';
import { Auth } from 'src/common/decorators/auth-jwt.decorator';
import { ApiTags } from '@nestjs/swagger';

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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Auth()
  async create(
    @ReqAuthUser() user: AuthUser,
    @Body() body: CreateBlogDto,
  ): Promise<void> {
    return this.service.create(body, user);
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth()
  async update(
    @ReqAuthUser() user: AuthUser,
    @Body() body: UpdateBlogDto,
  ): Promise<void> {
    return this.service.update(body, user);
  }
}
