import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/category.entity';
import { Occasion } from 'src/occasions/occasion.entity';
import { OccasionsService } from 'src/occasions/occasions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Occasion])],
  providers: [ProductsService, CategoriesService, OccasionsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
