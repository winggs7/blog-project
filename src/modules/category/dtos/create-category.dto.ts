import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsEnumValue } from 'src/common/decorators/enum-value.decorator';
import { EStatus } from 'src/constant/enum';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsEnumValue(EStatus)
  status = EStatus.active;
}
