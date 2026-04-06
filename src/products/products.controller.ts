import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Render,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { OccasionsService } from 'src/occasions/occasions.service';
import { SearchProductDto } from './dto/search-product.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly occasionsService: OccasionsService,
  ) {}

  // List products
  @Get()
  async getAll(@Req() req, @Query() query: SearchProductDto, @Res() res) {
    // Access the search term via query.search
    const searchTerm = query.search;
    const products = await this.productsService.findAllWithImages(searchTerm);

    if (query.ajax === 'true') {
      return res.json({
        products,
      });
    }

    const categories = await this.categoriesService.findAll();
    const occasions = await this.occasionsService.findAll();
    return res.render('pages/customer/products/list', {
      products,
      categories,
      occasions,
      searchKeyword: query.search, // Pass this back so the input field keeps the word
      title: query.search ? `Results for "${query.search}"` : 'All Products',
      user: req.user, // Pass the logged-in user (if any) to the template
    });
  }

  //Show create form
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('ADMIN', 'EMPLOYEE', 'MANAGER') // Only these roles can enter
  @Get('create')
  @Render('pages/staff/products/create')
  async getCreate() {
    const categories = await this.categoriesService.findAll();
    const occasions = await this.occasionsService.findAll();
    return {
      categories,
      occasions,
      title: 'Add New Baby Essential',
      layout: false, // We use Manual Wrap instead
    };
  }

  @UseGuards(AuthenticatedGuard, RolesGuard) // This guard will protect all routes in this controller by default
  @Roles('ADMIN', 'EMPLOYEE', 'MANAGER') // Only these roles can enter
  @Get('crud')
  @Render('pages/staff/products/product-crud')
  async test(@Query() query: SearchProductDto) {
    const searchTerm = query.search;

    const products = await this.productsService.findAll(searchTerm);
    const categories = await this.categoriesService.findAll();
    const occasions = await this.occasionsService.findAll();
    return {
      products,
      categories,
      occasions,
      searchKeyword: query.search, // Pass this back so the input field keeps the word
      title: query.search ? `Results for "${query.search}"` : 'All Products',
    };
  }

  //i did not implement product details page, so this is not used. But it can be used in the future if needed
  @Get(':id')
  //@Render('pages/customer/products/details')
  async getOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(Number(id));
    return { product };
  }

  @UseGuards(AuthenticatedGuard, RolesGuard) // This guard will protect all routes in this controller by default
  @Roles('ADMIN', 'EMPLOYEE', 'MANAGER') // Only these roles can enter
  @Get(':id/edit')
  @Render('pages/staff/products/edit')
  async getEdit(@Param('id') id: string) {
    const product = await this.productsService.findOne(Number(id));
    const categories = await this.categoriesService.findAll();
    return {
      product,
      categories,
      title: `Edit ${product?.name}`,
      layout: false,
    };
  }

  //Handle create

  @Post()
  @UseInterceptors(FileInterceptor('image'))//attribute in your HTML form
  @Redirect('/products/crud')
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: any,
  ) {
    await this.productsService.create(createProductDto, file?.buffer);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard) // This guard will protect all routes in this controller by default
  @Roles('ADMIN', 'EMPLOYEE', 'MANAGER') // Only these roles can enter
  @Post(':id/edit')
  @Redirect('/products/crud')
    @UseInterceptors(FileInterceptor('image'))//attribute in your HTML form
  async update(
    @Param('id') id: string,
     @Body() body: UpdateProductDto,
    @UploadedFile() file: any) {

    await this.productsService.update(+id, body, file?.buffer );
  }

  @UseGuards(AuthenticatedGuard, RolesGuard) // This guard will protect all routes in this controller by default
  @Roles('ADMIN', 'EMPLOYEE', 'MANAGER') // Only these roles can enter
  @Post(':id/delete')
  @Redirect('/products/crud')
  async delete(@Param('id') id: string) {
    await this.productsService.remove(+id);
  }
}
