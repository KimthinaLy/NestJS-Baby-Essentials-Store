import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn({ name: 'address_id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'receiver_name', length: 150 })
  receiverName: string;

  @Column({ name: 'phone', length: 20 })
  phone: string;

  @Column({ name: 'street', length: 255 })
  street: string;

  @Column({ name: 'city', length: 100 })
  city: string;

  @Column({ name: 'province', length: 100 })
  province: string;

  @Column({ name: 'postal_code', length: 20 })
  postalCode: string;

  // Establish the relationship with the User table
  @ManyToOne(() => User, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  
}