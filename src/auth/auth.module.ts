import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schema/token.schema';
import { AuthService } from './services/auth.service';
import { User, UserSchema } from 'src/modules/user/schema/user.schema';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthPasswordService } from './services/auth.password.service';
import { AuthLocalStrategy } from './strategies/auth.local.strategy';
import { AuthJwtAccessStrategy } from './strategies/auth.jwt-access.strategy';
import { AuthJwtRefreshStrategy } from './strategies/auth.jwt-refresh.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.jwt.accessLifeTime'),
        },
      }),
    }),
  ],
  exports: [AuthService],
  providers: [
    AuthService,
    AuthPasswordService,
    AuthLocalStrategy,
    AuthJwtAccessStrategy,
    AuthJwtRefreshStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
