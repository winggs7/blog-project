import { Module } from '@nestjs/common';
import { BlogModule } from 'src/modules/blog/blog.module';
import { BlogAdminController } from 'src/modules/blog/controllers/blog.admin.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { CategoryAdminController } from 'src/modules/category/controllers/category.admin.controller';

@Module({
  controllers: [CategoryAdminController, BlogAdminController],
  providers: [],
  exports: [],
  imports: [CategoryModule, BlogModule],
})
export class RoutesAdminModule {}
