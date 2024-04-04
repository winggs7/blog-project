import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from 'src/common/database/schema/base.schema';
import { defaultSchemaOptions } from 'src/common/utils/object.util';
import { EStatus } from 'src/constant/enum';

export type CategoryDocument = HydratedDocument<Category>;

@Schema(defaultSchemaOptions)
export class Category extends Base {
  @Prop()
  name: string;

  @Prop()
  status: EStatus;
}

const CategorySchema = SchemaFactory.createForClass(Category);

export { CategorySchema };
