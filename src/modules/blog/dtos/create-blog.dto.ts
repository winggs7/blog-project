import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
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
  // @IsEnumValue(EStatus) //TODO
  status = EStatus.active;
}
