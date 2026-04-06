import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  // Find a category by name and include all its products
  async findByNameWithProducts(name: string) {
    return await this.categoryRepo.findOne({
      where: { categoryName: name },
      relations: ['products'], // joins the tables
    });
  }

  async findAll() {
    return await this.categoryRepo.find();
  }
}
