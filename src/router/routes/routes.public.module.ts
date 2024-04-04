import { Module } from '@nestjs/common';
import { BlogModule } from 'src/modules/blog/blog.module';
import { BlogPublicController } from 'src/modules/blog/controllers/blog.public.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { CategoryPublicController } from 'src/modules/category/controllers/category.public.controller';

@Module({
  controllers: [CategoryPublicController, BlogPublicController],
  providers: [],
  exports: [],
  imports: [CategoryModule, BlogModule],
})
export class RoutesPublicModule {}
