import { Exclude, Expose } from 'class-transformer';
import { BaseResponse } from 'src/common/types/base.response';
import { EStatus } from 'src/constant/enum';

@Exclude()
export class CategoryResponse extends BaseResponse {
  @Expose()
  name: string;

  @Expose()
  status?: EStatus;
}
