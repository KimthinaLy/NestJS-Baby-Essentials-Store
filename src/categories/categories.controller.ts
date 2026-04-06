import {
  Controller,
  Get,
  Render,
  Param,
  Req,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { OccasionsService } from 'src/occasions/occasions.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService,
    private occasionsService: OccasionsService
  ) {}

  @Get(':name/products')
  @Render('pages/customer/products/list')
  async getProductsByCategory(@Req() req, @Param('name') name: string) {
    const category = await this.categoriesService.findByNameWithProducts(name);
    const categories = await this.categoriesService.findAll();  
    const occasions = await this.occasionsService.findAll();
    
    const productsWithImages = (category?.products || []).map((p) => ({
      ...p,
      imageData: p.image
        ? `data:image/png;base64,${p.image.toString('base64')}`
        : '/placeholder.png',
    }));

    return {
      products: productsWithImages,
      categories,
      occasions,
      title: `Category: ${category?.categoryName || 'Not Found'}`,
      user: req.user, // Pass the logged-in user (if any) to the template
    };
  }

  @Get()
  
  async getAllCategories() {
    const categories = await this.categoriesService.findAll();
    return { categories };
  }
}
