import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // We override the password in the Update DTO to make it optional
  // If provided, it still must meet the length requirement
  @IsOptional()
  @IsString()
  @ValidateIf((obj, value) => value !== '')
  @MinLength(5, { message: 'Password must be at least 5 characters if provided' })
  password?: string;
}