import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Occasion } from './occasion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OccasionsService {
  constructor(
    @InjectRepository(Occasion) private occasionRepo: Repository<Occasion>,
  ) {}

  async findByNameWithProducts(name: string) {
  return await this.occasionRepo.findOne({
    where: { name: name },
    relations: ['products'], // automatically queries the product_occasions table
  });
}

  findAll() {
    return this.occasionRepo.find();
  }
}
