import { BaseResponse } from 'src/common/types/base.response';
import { EStatus } from 'src/constant/enum';

export type CategoryResponse = BaseResponse & {
  name: string;
  status?: EStatus;
};
