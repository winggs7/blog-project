import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schema/blog.schema';
import { BlogService } from './blog.service';
import { Category, CategorySchema } from '../category/schema/category.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { BullModule } from '@nestjs/bullmq';
import { ImportProcessor } from './queues/import.processor';

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
  providers: [BlogService, ImportProcessor],
  controllers: [],
})
export class BlogModule {}
