import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from 'src/common/database/schema/base.schema';
import { defaultSchemaOptions } from 'src/common/utils/object.util';
import { EStatus } from 'src/constant/enum';
import { Category } from 'src/modules/category/schema/category.schema';
import { User } from 'src/modules/user/schema/user.schema';

export type BlogDocument = HydratedDocument<Blog>;

@Schema(defaultSchemaOptions)
export class Blog extends Base {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  banner: string;

  @Prop()
  status: EStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  author: User;
}

const BlogSchema = SchemaFactory.createForClass(Blog);

export { BlogSchema };
