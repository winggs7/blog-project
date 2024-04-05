import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthJwtAccessGuard } from 'src/auth/guards/auth.jwt-access.guard';
import { AuthJwtRefreshGuard } from 'src/auth/guards/auth.jwt-refresh.guard';

export function Auth(): MethodDecorator {
  return applyDecorators(UseGuards(AuthJwtAccessGuard));
}

export function RefreshGuard(): MethodDecorator {
  return applyDecorators(UseGuards(AuthJwtRefreshGuard));
}
