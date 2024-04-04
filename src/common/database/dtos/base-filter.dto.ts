import { Transform } from 'class-transformer';
import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { EStatus } from 'src/constant/enum';

export class BaseFilterParamDto {
  @IsOptional()
  @IsString()
  filter?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit = 10;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page = 1;

  @IsOptional()
  @Matches(/(?<column>[a-z]+(_[a-z]+)?)\s(?<dir>(asc|desc))$/)
  @IsString()
  sorting = 'created_at desc';

  @IsOptional()
  // @IsEnumValue(EStatus) //TODO
  @Transform(({ value }) => parseInt(value))
  status: EStatus;

  @IsOptional()
  @IsISO8601()
  date_from: Date;

  @IsOptional()
  @IsISO8601()
  // @CheckDateRange(30, 'date_from')
  date_to: Date;
}
