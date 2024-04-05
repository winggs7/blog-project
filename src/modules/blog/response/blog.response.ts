import { BaseResponse } from 'src/common/types/base.response';
import { EStatus } from 'src/constant/enum';
import { Category } from 'src/modules/category/schema/category.schema';

export type BlogResponse = BaseResponse & {
  title: string;
  content: string;
  category: Category;
  status?: EStatus;
};
