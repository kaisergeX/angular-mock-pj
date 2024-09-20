import { CreateCategoryRequest } from '@repo/shared';
import { IsString, Length } from 'class-validator';

export class CreateCategoryDto implements CreateCategoryRequest {
  @IsString()
  @Length(3, 255, { message: 'Name must be between 3 and 255 characters' })
  name: string;

  @IsString()
  @Length(0, 255, { message: 'Description must be less than 255 characters' })
  description?: string;
}
