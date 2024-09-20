import { CreateProductRequest, ProductStatus } from '@repo/shared';
import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateProductDto implements CreateProductRequest {
  @IsString()
  @Length(3, 255, { message: 'Name must be between 3 and 255 characters' })
  name: string;

  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @IsString()
  category: string;

  @IsEnum(ProductStatus, {
    message: `Status must be either ${ProductStatus.ACTIVE} or ${ProductStatus.INACTIVE}`,
  })
  status: ProductStatus;

  @IsString()
  @Length(0, 255, { message: 'Description must be less than 255 characters' })
  description?: string;

  @IsString()
  @Length(0, 255, { message: 'Image URL must be less than 255 characters' })
  image?: string;
}
