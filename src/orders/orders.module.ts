import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CartService } from 'src/cart/cart.service';
import { AddressService } from 'src/address/address.service';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Address } from 'src/address/address.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Cart, CartItem, Address])],
  controllers: [OrdersController],
  providers: [OrdersService, CartService, AddressService],

})
export class OrdersModule {}
