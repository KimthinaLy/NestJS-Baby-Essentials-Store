import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
  ) {}

  async findOrCreateCart(userId: number): Promise<any> {
    const cart = await this.cartRepo.findOne({
      where: { user_id: userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      const newCart = this.cartRepo.create({ user_id: userId });
      await this.cartRepo.save(newCart);
      return { ...newCart, items: [] };
    }

    // Transform the product images to Base64 strings
    const transformedItems = cart.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        // Apply the same logic from your product list
        displayImage: item.product.image
          ? `data:image/png;base64,${item.product.image.toString('base64')}`
          : '/images/logo2.png',
      },
    }));

    return { ...cart, items: transformedItems };
  }

  async addToCart(userId: number, productId: number, qty: number) {
    const cart = await this.findOrCreateCart(userId);

    // Check if product already exists in cart
    let item = await this.itemRepo.findOne({
      where: { cart_id: cart.cart_id, product_id: productId },
    });

    if (item) {
      item.quantity += qty;
    } else {
      item = this.itemRepo.create({
        cart_id: cart.cart_id,
        product_id: productId,
        quantity: qty,
      });
    }
    return this.itemRepo.save(item);
  }

  // Inside CartService class

  async updateQuantity(
    userId: number,
    productId: number,
    action: 'increase' | 'decrease',
  ) {
    const cart = await this.findOrCreateCart(userId);
    const item = await this.itemRepo.findOne({
      where: { cart_id: cart.cart_id, product_id: productId },
    });

    if (item) {
      if (action === 'increase') {
        item.quantity += 1;
      } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity -= 1;
      }
      await this.itemRepo.save(item);
    }
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.findOrCreateCart(userId);
    await this.itemRepo.delete({
      cart_id: cart.cart_id,
      product_id: productId,
    });
  }

  async clearCart(userId: number): Promise<void> {
    // 1. Find the cart belonging to the user
    const cart = await this.cartRepo.findOne({ 
      where: { user_id: userId } 
    });

    if (cart) {
      // 2. Delete all items linked to this cart_id
      // This clears the "shopping list" without deleting the cart itself
      await this.itemRepo.delete({ cart_id: cart.cart_id });
    }
  }
}
