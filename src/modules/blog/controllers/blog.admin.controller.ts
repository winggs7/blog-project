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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlogService } from '../blog.service';
import { FilterBlogDto } from '../dtos/filter-blog.dto';
import { ValidateMongoId } from 'src/common/utils/validate.util';
import { CreateBlogDto } from '../dtos/create-blog.dto';
import { UpdateBlogDto } from '../dtos/update-blog.dto';
import { AuthUser } from 'src/auth/types/auth.type';
import { ReqAuthUser } from 'src/common/decorators/request.decorator';
import { Auth } from 'src/common/decorators/auth-jwt.decorator';

@Controller('blogs')
@ApiTags('Blogs')
@ApiBearerAuth('accessToken')
export class BlogAdminController {
  constructor(private readonly service: BlogService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth()
  async getList(@Query() param: FilterBlogDto) {
    return await this.service.getList(param);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth()
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

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth()
  async delete(@Param('id', ValidateMongoId) id: string): Promise<void> {
    return this.service.delete(id);
  }
}
