import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity({name: 'occasions'})
export class Occasion {
  @PrimaryGeneratedColumn({ name: 'occasion_id' })
  id: number;

  @Column({ name: 'occasion_name', length: 100 })
  name: string;

  @ManyToMany(() => Product, (product) => product.occasions)
  products: Product[];
}