import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OccasionsModule } from './occasions/occasions.module';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '01685027',
    database: 'babyessential',
    autoLoadEntities: true,
    synchronize: false,
  }), ProductsModule, CategoriesModule, OccasionsModule, UserModule, AddressModule, AuthModule, CartModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
