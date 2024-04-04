import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from 'src/common/database/schema/base.schema';
import { defaultSchemaOptions } from 'src/common/utils/object.util';
import { EStatus } from 'src/constant/enum';
import { Blog } from 'src/modules/blog/schema/blog.schema';

export type UserDocument = HydratedDocument<User>;

@Schema(defaultSchemaOptions)
export class User extends Base {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Blog' })
  blogs: Blog[];

  @Prop()
  status: EStatus;

  @Prop()
  role: EStatus;

  @Prop()
  full_name: string;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
