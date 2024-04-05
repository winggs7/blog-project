import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsEnumValue } from 'src/common/decorators/enum-value.decorator';
import { EStatus } from 'src/constant/enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value?.toString()?.trim()?.toLowerCase())
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string;

  @IsOptional()
  @IsString()
  full_name: string;

  @IsOptional()
  @IsEnumValue(EStatus)
  status = EStatus.active;
}
