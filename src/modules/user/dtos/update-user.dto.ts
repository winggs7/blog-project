import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateUserDto) {
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  id: string;
}
