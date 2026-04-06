// dto/search-product.dto.ts
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchProductDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim()) // Automatically removes leading/trailing spaces
  @MaxLength(50, { message: 'Search term is too long' })
  search?: string;

  @IsOptional()
  ajax?: string;
}