import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  id: string;
}
