import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsEnumValue } from 'src/common/decorators/enum-value.decorator';
import { EStatus } from 'src/constant/enum';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  banner: string;

  @IsOptional()
  @IsEnumValue(EStatus)
  status = EStatus.active;
}
