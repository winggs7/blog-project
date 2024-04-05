import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/user/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { EStatus } from 'src/constant/enum';

@Injectable()
export class AuthPasswordService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async passwordAuthenticate(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    await this._checkPassword(user, password);
    await this._checkAccountStatus(user);
    return user;
  }

  private async _checkAccountStatus(user: User): Promise<void> {
    if (user.status === EStatus.inactive) {
      throw new HttpException('ACCOUNT_INACTIVE', HttpStatus.UNAUTHORIZED);
    }
  }

  private async _checkPassword(user: User, password: string): Promise<void> {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
  }
}
