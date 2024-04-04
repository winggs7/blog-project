import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RoutesPublicModule } from './routes/routes.public.module';
import { RoutesAdminModule } from './routes/routes.admin.module';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (
      | DynamicModule
      | Type
      | Promise<DynamicModule>
      | ForwardReference
    )[] = [];

    imports.push(
      RoutesPublicModule,
      RoutesAdminModule,
      NestJsRouterModule.register([
        {
          path: 'api/v1', //TODO
          module: RoutesPublicModule,
        },
        {
          path: 'api/v1/admin', //TODO
          module: RoutesAdminModule,
        },
      ]),
    );

    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
