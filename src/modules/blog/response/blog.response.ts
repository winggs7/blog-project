import { Exclude, Expose, Type } from 'class-transformer';
import { BaseResponse } from 'src/common/types/base.response';
import { EStatus } from 'src/constant/enum';
import { CategoryResponse } from 'src/modules/category/response/category.response';
import { UserResponse } from 'src/modules/user/response/user.response';

@Exclude()
export class BlogResponse extends BaseResponse {
  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => CategoryResponse)
  category: CategoryResponse;

  @Expose()
  @Type(() => UserResponse)
  author: UserResponse;

  @Expose()
  status?: EStatus;
}
