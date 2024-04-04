import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { EStatus } from 'src/constant/enum';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  // @IsEnumValue(EStatus) //TODO
  status = EStatus.active;
}
