import { Module } from '@nestjs/common';
import { BlogModule } from 'src/modules/blog/blog.module';
import { BlogAdminController } from 'src/modules/blog/controllers/blog.admin.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { CategoryAdminController } from 'src/modules/category/controllers/category.admin.controller';
import { UserAdminController } from 'src/modules/user/controllers/user.admin.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [
    CategoryAdminController,
    BlogAdminController,
    UserAdminController,
  ],
  providers: [],
  exports: [],
  imports: [CategoryModule, BlogModule, UserModule],
})
export class RoutesAdminModule {}
