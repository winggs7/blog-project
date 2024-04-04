import { MongooseModule } from '@nestjs/mongoose';

export const databaseConfig = MongooseModule.forRoot(
  'mongodb://localhost/blog',
);
