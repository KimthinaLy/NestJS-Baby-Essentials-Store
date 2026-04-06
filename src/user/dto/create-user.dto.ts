import { 
  IsEmail, 
  IsEnum, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  MinLength, 
  MaxLength, 
  ValidateNested,
  IsObject
} from 'class-validator';
import { UserRole } from '../user.entity';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @MaxLength(150)
  fullName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(150)
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(5, { message: 'Password must be at least 8 characters long' })
  @MaxLength(255)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;


  //@IsNotEmpty({ message: 'A role must be assigned' })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be ADMIN, MANAGER, EMPLOYEE, or CUSTOMER' })
  role: UserRole;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto; // The form will send this as a nested object
}