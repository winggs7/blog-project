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
import { UserService } from '../user.service';
import { FilterUserDto } from '../dtos/filter-user.dto';
import { ValidateMongoId } from 'src/common/utils/validate.util';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth('accessToken')
export class UserAdminController {
  constructor(private readonly service: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getList(@Query() param: FilterUserDto) {
    return await this.service.getList(param);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id', ValidateMongoId) id: string) {
    return await this.service.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserDto): Promise<void> {
    return this.service.create(body, true);
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Body() body: UpdateUserDto): Promise<void> {
    return this.service.update(body);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ValidateMongoId) id: string): Promise<void> {
    return this.service.delete(id);
  }
}
