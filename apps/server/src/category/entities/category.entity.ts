import { CategorySchema } from '@repo/shared';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category implements CategorySchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}
