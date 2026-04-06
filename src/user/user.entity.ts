import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Address } from 'src/address/address.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  CUSTOMER = 'CUSTOMER',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Column({ name: 'email', length: 150, unique: true })
  email: string;

  @Column({ name: 'password', length: 255 })
  @Exclude() // Prevents password from being leaked in JSON responses
  password: string;

  @Column({ name: 'phone', length: 20, nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}