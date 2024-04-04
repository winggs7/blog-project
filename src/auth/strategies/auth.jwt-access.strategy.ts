import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { AuthPayLoad, AuthUser } from '../types/auth.type';
import { EAuthType } from '../constants/auth.enum';

@Injectable()
export class AuthJwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt_access',
) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.accessSecret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AuthPayLoad): Promise<AuthUser> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    return await this.authService.verifyToken(
      payload.uid,
      token,
      EAuthType.access,
    );
  }
}
