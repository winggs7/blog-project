import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';

@Exclude()
export class BaseResponse {
  @Expose({ name: '_id' })
  id: string | number | Types.ObjectId;

  @Expose()
  created_at?: Date | string;

  @Expose()
  updated_at?: Date | string;
}
