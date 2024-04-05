import { Module } from '@nestjs/common';
import { BlogModule } from 'src/modules/blog/blog.module';
import { BlogPublicController } from 'src/modules/blog/controllers/blog.public.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { CategoryPublicController } from 'src/modules/category/controllers/category.public.controller';
import { UserPublicController } from 'src/modules/user/controllers/user.public.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [
    CategoryPublicController,
    BlogPublicController,
    UserPublicController,
  ],
  providers: [],
  exports: [],
  imports: [CategoryModule, BlogModule, UserModule],
})
export class RoutesPublicModule {}
