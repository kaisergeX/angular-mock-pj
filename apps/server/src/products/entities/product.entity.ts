import { ProductSchema, ProductStatus } from '@repo/shared';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '~/category/entities/category.entity';

@Entity()
export class Product implements ProductSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  categoryId: number;

  @Column()
  categoryName: string;

  @Column({
    // type: 'enum', // sqlite does not support enum
    // enum: ProductStatus,
    default: ProductStatus.INACTIVE,
  })
  status: ProductStatus;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
