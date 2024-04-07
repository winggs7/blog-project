import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { ListPaginate } from 'src/common/database/types/database.types';
import { FilterUserDto } from './dtos/filter-user.dto';
import { wrapPagination } from 'src/common/utils/object.util';
import { ChangePasswordDto, UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ERole } from 'src/constant/enum';
import { Token, TokenDocument } from 'src/auth/schema/token.schema';
import { AuthUser } from 'src/auth/types/auth.type';
import { UserResponse } from './response/user.response';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async create(input: CreateUserDto, isAdmin?: boolean): Promise<void> {
    const find = await this.userModel.findOne({
      username: input.username.toLowerCase(),
    });
    if (find) {
      throw new HttpException('USERNAME_IN_USED', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(input.password, 12);

    const createdUser = new this.userModel({
      ...input,
      username: input.username.toLowerCase(),
      password: hashPassword,
      role: isAdmin ? ERole.admin : ERole.user,
    });
    await createdUser.save();
  }

  async getById(id: string): Promise<UserResponse> {
    const user = await this.userModel
      .findOne({ _id: id })
      .populate({
        path: 'blogs',
      })
      .select(['-password']);
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }

  async getList(params: FilterUserDto): Promise<ListPaginate<UserResponse>> {
    const data = await this.userModel
      .find({ name: new RegExp(params.filter, 'i') })
      .limit(params.limit)
      .skip(params.limit * (params.page - 1))
      .sort({
        created_at: 'asc',
      })
      .exec();

    return wrapPagination<UserResponse>(
      plainToInstance(UserResponse, data, {
        excludeExtraneousValues: true,
      }),
      data.length,
      params,
    );
  }

  async update(input: UpdateUserDto): Promise<void> {
    await this.getById(input.id);
    await this.userModel.findByIdAndUpdate(input.id, input);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.userModel.findByIdAndDelete(id);
  }

  async changePassword(
    input: ChangePasswordDto,
    loggedUser: AuthUser,
  ): Promise<void> {
    const user = await this.userModel.findById(loggedUser.id);

    if (input.new_password === input.current_password) {
      throw new HttpException('NEW_PASS_SAME_CUR_PASS', HttpStatus.BAD_REQUEST);
    }

    const checkedCurrentPassword = await bcrypt.compare(
      input.current_password,
      user.password,
    );
    if (!checkedCurrentPassword) {
      throw new HttpException('PASS_NOT_MATCH', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(input.new_password, 12);

    await Promise.all([
      this.userModel.findByIdAndUpdate(user['_id'], {
        ...user,
        password: hashPassword,
      }),
      this.tokenModel.findByIdAndDelete(user['_id']),
    ]);
  }
}
