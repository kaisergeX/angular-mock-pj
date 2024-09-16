import { ProductSchema, ProductStatus } from '@repo/shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product implements ProductSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  category: string;

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
}
