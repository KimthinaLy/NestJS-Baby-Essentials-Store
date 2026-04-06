import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { OccasionsService } from 'src/occasions/occasions.service';
import { OccasionsController } from 'src/occasions/occasions.controller';
import { Occasion } from 'src/occasions/occasion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Occasion])],
  providers: [CategoriesService, OccasionsService],
  controllers: [CategoriesController, OccasionsController],
})
export class CategoriesModule {}
