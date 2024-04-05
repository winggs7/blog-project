import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../user.service';
import { FilterUserDto } from '../dtos/filter-user.dto';
import { ValidateMongoId } from 'src/common/utils/validate.util';
import { Auth } from 'src/common/decorators/auth-jwt.decorator';
import { ReqAuthUser } from 'src/common/decorators/request.decorator';
import { AuthUser } from 'src/auth/types/auth.type';
import { ChangePasswordDto } from '../dtos/update-user.dto';

@Controller('users')
@ApiTags('Users')
export class UserPublicController {
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

  @Put('/change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth()
  async changePassword(
    @ReqAuthUser() user: AuthUser,
    @Body() body: ChangePasswordDto,
  ): Promise<void> {
    await this.service.changePassword(body, user);
  }
}
