import { IsNotEmpty, IsString, MaxLength, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAddressDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsNotEmpty({ message: 'Receiver name is required' })
  @IsString()
  @MaxLength(150)
  receiverName: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsNotEmpty({ message: 'Street address is required' })
  @IsString()
  @MaxLength(255)
  street: string;

  @IsNotEmpty({ message: 'City is required' })
  @IsString()
  @MaxLength(100)
  city: string;

  @IsNotEmpty({ message: 'Province/State is required' })
  @IsString()
  @MaxLength(100)
  province: string;

  @IsNotEmpty({ message: 'Postal code is required' })
  @IsString()
  @MaxLength(20)
  postalCode: string;
}