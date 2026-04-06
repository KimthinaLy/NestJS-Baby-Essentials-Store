import { Controller, Get, Post, Body, Req, UseGuards, Render, Res, UnauthorizedException } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  @Render('pages/customer/cart/cart')
  async getCart(@Req() req) {
    if (!req.user || !req.user.id) {
    throw new UnauthorizedException('Session expired or user not found');
  }

    const cart = await this.cartService.findOrCreateCart(req.user.id);
    return { 
      cart, 
      user: req.user 
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('add')
  async addToCart(@Req() req, @Body('productId') productId: number, @Res() res) {
    await this.cartService.addToCart(req.user.id, productId, 1);
    res.redirect('/products');
  }

  // Inside CartController class

@UseGuards(AuthenticatedGuard)
@Post('update')
async updateCart(
  @Req() req, 
  @Body('productId') productId: number, 
  @Body('action') action: 'increase' | 'decrease',
  @Res() res
) {
  await this.cartService.updateQuantity(req.user.id, productId, action);
  
  // Fetch the fresh cart data to send back to the UI
  const cart = await this.cartService.findOrCreateCart(req.user.id);
  const total = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Return JSON instead of redirecting
  return res.json({ success: true, cart, total });
}

@UseGuards(AuthenticatedGuard)
@Post('remove')
async removeFromCart(
  @Req() req, 
  @Body('productId') productId: number, 
  @Res() res
) {
  await this.cartService.removeItem(req.user.id, productId);
  res.redirect('/cart');
}
}