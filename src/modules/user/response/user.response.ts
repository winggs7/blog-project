import { Exclude, Expose } from 'class-transformer';
import { BaseResponse } from 'src/common/types/base.response';
import { ERole, EStatus } from 'src/constant/enum';

@Exclude()
export class UserResponse extends BaseResponse {
  @Expose()
  username: string;

  @Expose()
  full_name: string;

  @Expose()
  role?: ERole;

  @Expose()
  status?: EStatus;
}
