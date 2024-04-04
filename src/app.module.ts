import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configs from './configs';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from './router/router.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    TerminusModule,
    RouterModule.forRoot(),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
