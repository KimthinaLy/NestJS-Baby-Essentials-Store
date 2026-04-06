import { Injectable } from '@nestjs/common';

import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async findAll(search?: string) {
   const query = this.productRepo.createQueryBuilder('product')
    // include these so the relations are available globally
    .leftJoinAndSelect('product.category', 'category')
    .leftJoinAndSelect('product.occasions', 'occasions');

  if (search) {
    query.andWhere('(product.name LIKE :search OR product.description LIKE :search)', { 
      search: `%${search}%` 
    });
  }

  return await query.getMany();
  }

  async findAllWithImages(search?: string) {
    const products = await this.findAll(search);

    return products.map((product) => ({
      ...product,
      imageData: product.image
        ? `data:image/png;base64,${product.image.toString('base64')}`
        : '/images/placeholder.png',
    }));
  }

  findOne(id: number) {
    return this.productRepo.findOne({ where: { id } });
  }

  create(dto: CreateProductDto, imageBuffer?: Buffer) {
    const product = this.productRepo.create({
    ...dto,
    image: imageBuffer, // This maps to your 'image' column (type: 'bytea' or 'blob')
  });
    return this.productRepo.save(product);
  }

  async update(id: number, dto: UpdateProductDto, imageBuffer?: Buffer) {
    const updateData: any = { ...dto };
  
  if (imageBuffer) {
    updateData.image = imageBuffer;
  }

    await this.productRepo.update(id, updateData);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.productRepo.delete(id);
  }
}
