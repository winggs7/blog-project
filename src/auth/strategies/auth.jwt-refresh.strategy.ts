import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthPayLoad, AuthUser } from '../types/auth.type';
import { EAuthType } from '../constants/auth.enum';

@Injectable()
export class AuthJwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt_refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AuthPayLoad): Promise<AuthUser> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    const user = await this.authService.verifyToken(
      payload.uid,
      token,
      EAuthType.refresh,
    );
    await this.authService.removeToken(token, EAuthType.refresh);

    return user;
  }
}
