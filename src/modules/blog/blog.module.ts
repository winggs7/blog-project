import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schema/blog.schema';
import { BlogService } from './blog.service';
import { Category, CategorySchema } from '../category/schema/category.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { BullModule } from '@nestjs/bullmq';
import { ImportProcessor } from './queues/import.processor';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    BullModule.registerQueue({
      name: 'import',
    }),
  ],
  exports: [BlogService],
  providers: [
    BlogService,
    ImportProcessor,
    {
      provide: 'IMPORT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const rmqUser: string = configService.get<string>(
          'microservice.rabbitmq.user',
        );
        const rmqPass: string = configService.get<string>(
          'microservice.rabbitmq.password',
        );
        const rmqHost: string = configService.get<string>(
          'microservice.rabbitmq.host',
        );
        const rmqQueue: string = configService.get<string>(
          'microservice.rabbitmq.queue',
        );

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${rmqUser}:${rmqPass}@${rmqHost}`],
            queue: rmqQueue,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [],
})
export class BlogModule {}
