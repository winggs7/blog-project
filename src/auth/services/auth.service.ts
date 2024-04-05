import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from '../schema/token.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/user/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthBody, AuthPayLoad, AuthToken, AuthUser } from '../types/auth.type';
import { AuthPasswordService } from './auth.password.service';
import { EAuthType } from '../constants/auth.enum';
import { EStatus } from 'src/constant/enum';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authPasswordService: AuthPasswordService,
  ) {}

  async authentication(body: AuthBody): Promise<AuthUser> {
    this._validateAuthenticate(body);

    const user: User = await this.authPasswordService.passwordAuthenticate(
      body.username,
      body.password,
    );

    const authUser: AuthUser = this._generateAuthUser(user);

    return authUser;
  }

  async verifyToken(
    userId: string,
    authToken: string,
    type: EAuthType,
  ): Promise<AuthUser> {
    const token = await this.tokenModel.findOne({
      user: userId,
      [type === EAuthType.access ? 'access_token' : 'refresh_token']: authToken,
    });

    if (!token) {
      throw new HttpException(
        'UNAUTHORIZED_TOKEN_INVALID',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException(
        'UNAUTHORIZED_USER_NOT_FOUND',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.status === EStatus.inactive) {
      throw new HttpException('ACCOUNT_INACTIVE', HttpStatus.UNAUTHORIZED);
    }

    return {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      role: user.role,
    };
  }

  async token(user: AuthUser): Promise<AuthToken> {
    const { token: accessToken, expired: accessTokenExpiresAt } =
      this._generateToken(
        user,
        this.configService.get<string>('auth.jwt.accessSecret'),
        this.configService.get<number>('auth.jwt.accessLifeTime'),
      );

    const { token: refreshToken, expired: refreshTokenExpiresAt } =
      this._generateToken(
        user,
        this.configService.get<string>('auth.jwt.refreshSecret'),
        this.configService.get<number>('auth.jwt.refreshLifeTime'),
      );
    const token = new Token();

    Object.assign(token, {
      user: user.id,
      access_token: accessToken,
      access_token_expires_at: accessTokenExpiresAt,
      refresh_token: refreshToken,
      refresh_token_expires_at: refreshTokenExpiresAt,
    });

    await this.tokenModel.deleteMany({ user: user.id });
    await new this.tokenModel(token).save();

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
      user: {
        id: user.id,
        role: user.role,
      },
    };
  }

  async removeToken(token: string, type: EAuthType): Promise<void> {
    await this.tokenModel.deleteOne({
      [type === EAuthType.access ? 'access_token' : 'refresh_token']: token,
    });
  }

  private _generateAuthUser(user: User): AuthUser {
    return {
      id: user['_id'].toString(),
      full_name: user.full_name,
      username: user.username,
      role: user.role,
    };
  }

  private _generateToken(
    user: AuthUser,
    secret: string,
    lifetime: number,
  ): { token: string; expired: Date } {
    const now = dayjs().unix();

    const payload: AuthPayLoad = {
      iat: now,
      uid: user.id,
      claims: {
        user_id: user.id,
        username: user.username,
      },
    };

    return {
      token: this.jwtService.sign(payload, {
        secret: secret,
        expiresIn: now + lifetime,
      }),
      expired: new Date((now + lifetime) * 1000),
    };
  }

  private _validateAuthenticate(body: AuthBody) {
    if (!body.password || !body.username) {
      throw new HttpException(
        'UNAUTHORIZED_INVALID_AUTH',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
