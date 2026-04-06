import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, JoinColumn, ManyToOne} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Address } from 'src/address/address.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column()
  user_id: number;

  @Column()
  address_id: number;

  @CreateDateColumn()
  order_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'enum', enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'], default: 'PENDING' })
  order_status: string;

  @Column({ length: 50 })
  payment_method: string;

  @Column({ type: 'enum', enum: ['UNPAID', 'PAID'], default: 'UNPAID' })
  payment_status: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' }) // Tells TypeORM to use 'address_id' for the JOIN
  address: Address;
}