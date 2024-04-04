import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '../types/auth.type';

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard('jwt_access') {
  handleRequest<User = AuthUser>(err: Error, user: User): User {
    if (err) {
      throw err;
    } else if (!user) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
