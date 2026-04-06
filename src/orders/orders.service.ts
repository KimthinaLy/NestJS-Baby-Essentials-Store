import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    private cartService: CartService,
  ) {}

  //=====================For Admin Use =====================
  async findAll() {
    return await this.orderRepo.find({
    order: { order_date: 'DESC' }
  });
  }

  // Update status
async update(id: number, updateData: Partial<Order>) {
  return await this.orderRepo.update(id, updateData);
}

// Delete order
async remove(id: number) {
  const order = await this.orderRepo.findOne({ where: { order_id: id } });
  if (order && (order.order_status === 'COMPLETED' || order.order_status === 'CANCELLED')) {
    return await this.orderRepo.remove(order);
  }
  throw new BadRequestException('Only completed or cancelled orders can be deleted.');
}

async findOneWithOrderId(orderId: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { order_id: orderId}, 
      relations: ['address', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const transformedOrder = {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          displayImage: item.product.image
            ? `data:image/png;base64,${item.product.image.toString('base64')}`
            : '/images/logo2.png',
        },
      })),
    };

    return transformedOrder;
  }

//=====================For Customer Use =====================
  async createOrder(userId: number, addressId: number, paymentMethod: string) {
    // 1. Get the current cart
    const cart = await this.cartService.findOrCreateCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // 2. Calculate Total
    const total = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    // 3. Create the Order Record
    const newOrder = this.orderRepo.create({
      user_id: userId,
      address_id: addressId,
      total_amount: total,
      payment_method: paymentMethod,
      order_status: 'PENDING',
      payment_status: paymentMethod === 'cod' ? 'UNPAID' : 'PAID', // Simple logic for COD
    });

    const savedOrder = await this.orderRepo.save(newOrder);

    // 4. Create Order Items (Snapshots of products)
    const orderItems = cart.items.map(cartItem => {
      return this.orderItemRepo.create({
        order_id: savedOrder.order_id,
        product_id: cartItem.product.id,
        quantity: cartItem.quantity,
        product_name: cartItem.product.name,
        price: cartItem.product.price,
      });
    });

    await this.orderItemRepo.save(orderItems);

    // 5. CLEAR THE CART
    await this.cartService.clearCart(userId);

    return savedOrder;
  }

  async findAllByUser(userId: number) {
    return this.orderRepo.find({
      where: { user_id: userId },
      order: { order_date: 'DESC' },
      relations: ['items']
    });
  }

  async findOne(orderId: number, userId: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { order_id: orderId, user_id: userId }, // Security: ensure user owns the order
      relations: ['address', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const transformedOrder = {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          displayImage: item.product.image
            ? `data:image/png;base64,${item.product.image.toString('base64')}`
            : '/images/logo2.png',
        },
      })),
    };

    return transformedOrder;
  }
}