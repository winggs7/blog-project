import { BaseResponse } from 'src/common/types/base.response';
import { ERole, EStatus } from 'src/constant/enum';

export type UserResponse = BaseResponse & {
  username: string;
  full_name: string;
  role?: ERole;
  status?: EStatus;
};
