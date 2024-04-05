import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthLocalGuard } from './guards/auth.local.guard';
import { AuthToken, AuthUser } from './types/auth.type';
import { ExtractJwt } from 'passport-jwt';
import { EAuthType } from './constants/auth.enum';
import { ReqAuthUser } from 'src/common/decorators/request.decorator';
import { Auth, RefreshGuard } from 'src/common/decorators/auth-jwt.decorator';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthLocalGuard)
  @Post('/token')
  async login(@ReqAuthUser() user: AuthUser): Promise<AuthToken> {
    return this.authService.token(user);
  }

  @RefreshGuard()
  @Post('/refresh')
  async refresh(@ReqAuthUser() user: AuthUser): Promise<AuthToken> {
    return this.authService.token(user);
  }

  @Auth()
  @Post('/revoke')
  async revoke(@Req() req: Request): Promise<void> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    return this.authService.removeToken(token, EAuthType.access);
  }
}
