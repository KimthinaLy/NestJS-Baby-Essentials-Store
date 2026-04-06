import {
  Controller,
  Req,
  Body,
  Res,
  Post,
  Get,
  Render,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { AddressService } from 'src/address/address.service';
import { CartService } from 'src/cart/cart.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('orders')
@UseGuards(AuthenticatedGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly cartService: CartService,
    private readonly addressService: AddressService,
  ) {}

  @Get()
  @Render('pages/customer/order/order-history')
  async getMyOrders(@Req() req) {
    const orders = await this.ordersService.findAllByUser(req.user.id);
    return { orders, title: 'My Orders', user: req.user };
  }

  @Get('checkout')
  @Render('pages/customer/order/checkout')
  @UseGuards(AuthenticatedGuard)
  async getCheckout(@Req() req, @Query('error') error: string) {
    const userId = req.user.id;

    // 1. Get the cart (using the service we updated earlier with Base64 images)
    const cart = await this.cartService.findOrCreateCart(userId);

    // 2. Get the default address for this user
    const address = await this.addressService.findDefaultByUserId(userId);

    // 3. Calculate total
    const total = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    return {
      error,
      user: req.user,
      cart,
      address,
      total,
      title: 'Checkout',
    };
  }

  @Get('success')
  @Render('pages/customer/order/success')
  async orderSuccess(@Req() req) {
    return { title: 'Order Success', user: req.user };
  }

  @UseGuards(AuthenticatedGuard, RolesGuard) // This guard will protect all routes in this controller by default
  @Roles('ADMIN', 'EMPLOYEE', 'MANAGER')
  @Get('staff')
  @Render('pages/staff/order/manage-order')
  async getAllOrders() {
    const orders = await this.ordersService.findAll(); // Fetches all orders in system
    return { orders, title: 'Staff - Order Management' };
  }

  @Get(':id')
  @Render('pages/customer/order/order-items')
  async getOrderDetails(@Param('id') id: number, @Req() req, @Res() res) {
    try {
      const order = await this.ordersService.findOne(id, req.user.id);

      return {
        title: `Order #${order.order_id}`,
        order: order,
        user: req.user,
      };
    } catch (error) {
      return res.redirect('/orders');
    }
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles('ADMIN', 'EMPLOYEE', 'MANAGER')
  @Get(':id/staff')
  @Render('pages/staff/order/order-items')
  async getOrderDetailsStaff(@Param('id') id: number, @Req() req, @Res() res) {
    try {
      const order = await this.ordersService.findOneWithOrderId(id);

      return {
        title: `Order #${order.order_id}`,
        order: order,
      };
    } catch (error) {
      return res.redirect('/orders/staff');
    }
  }

  @Post('place')
  async placeOrder(@Req() req, @Body() body, @Res() res) {
    try {
      // address_id should come from a hidden input or selection in your checkout form
      const { addressId, paymentMethod } = body;

      const order = await this.ordersService.createOrder(
        req.user.id,
        addressId,
        paymentMethod || 'Cash on Delivery',
      );

      // Redirect to a success page
      res.redirect(`/orders/success`);
    } catch (error) {
      res.redirect('/orders/checkout?error=order_failed');
    }
  }

  @UseGuards(AuthenticatedGuard, RolesGuard) // This guard will protect all routes in this controller by default
  @Roles('ADMIN', 'EMPLOYEE', 'MANAGER')
  @Post('update/:id')
  async updateStatus(@Param('id') id: number, @Body() body, @Res() res) {
    const { orderStatus, paymentStatus } = body;
    await this.ordersService.update(id, {
      order_status: orderStatus,
      payment_status: paymentStatus,
    });
    res.redirect('/orders/staff');
  }

  @UseGuards(AuthenticatedGuard, RolesGuard) // This guard will protect all routes in this controller by default
  @Roles('ADMIN', 'EMPLOYEE', 'MANAGER')
  @Post('delete/:id')
  async deleteOrder(@Param('id') id: number, @Res() res) {
    await this.ordersService.remove(id);
    res.redirect('/orders/staff');
  }
}
