import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { BaseFilterParamDto } from 'src/common/database/dtos/base-filter.dto';

export class FilterBlogDto extends BaseFilterParamDto {
  @IsOptional()
  @IsMongoId()
  @IsString()
  category_id: string;
}
