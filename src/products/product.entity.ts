import { Category } from 'src/categories/category.entity';
import { Occasion } from 'src/occasions/occasion.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({name: 'product_id'})
  id: number;

  @Column({ name: 'name', length: 80 })
  name: string;

  @Column({ name: 'price', type: 'decimal', precision: 5, scale: 2 })
  price: number;

  @Column({ name: 'qty_on_hand', type: 'int' })
  qtyOnHand: number;

  @Column({ name: 'image', type: 'mediumblob', nullable: true })
  image: Buffer;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  // Many products can belong to ONE category
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @ManyToMany(() => Occasion, (occasion) => occasion.products)
  @JoinTable({
    name: 'product_occasions',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'occasion_id', referencedColumnName: 'id' },

  })
  occasions: Occasion[];
  
}
