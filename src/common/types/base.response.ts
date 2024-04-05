import { Types } from 'mongoose';

export type BaseResponse = {
  _id: string | number | Types.ObjectId;
  created_at?: Date | string;
  updated_at?: Date | string;
};
