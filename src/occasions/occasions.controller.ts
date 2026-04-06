import { Controller, Get, Render, Param, Req } from '@nestjs/common';
import { OccasionsService } from './occasions.service';
import { CategoriesService } from 'src/categories/categories.service';

@Controller('occasions')
export class OccasionsController {
  constructor(
    private occasionsService: OccasionsService,
    private categoriesService: CategoriesService,
  ) {}

  @Get(':name/products')
  @Render('pages/customer/products/list')
  async getProductsByOccasion(@Req() req, @Param('name') name: string) {
    const occasion = await this.occasionsService.findByNameWithProducts(name);
    const categories = await this.categoriesService.findAll();
    const occasions = await this.occasionsService.findAll();
    const productsWithImages = (occasion?.products || []).map((p) => ({
      ...p,
      imageData: p.image
        ? `data:image/png;base64,${p.image.toString('base64')}`
        : '/placeholder.png',
    }));
    return {
      products: productsWithImages,
      categories,
      occasions,
      title: `Occasion: ${occasion?.name || 'Not Found'}`,
      user: req.user, // Pass the logged-in user (if any) to the template
    };
  }
}
