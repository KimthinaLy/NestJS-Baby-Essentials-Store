import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  @Min(0, { message: 'Price must be a positive number' })
  price: number;

  @IsNotEmpty({ message: 'Quantity on hand is required' })
  @IsNumber()
  @Min(0, { message: 'Quantity on hand must be a positive number' })
  @Type(() => Number)
  qtyOnHand: number;
  
  @IsOptional()
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsString()
  description?: string;
}
