import type { ProductStatus } from '../constants';

export interface ProductSchema {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category: string;
  status: ProductStatus;
}

export type CreateProductRequest = Omit<ProductSchema, 'id'>;
