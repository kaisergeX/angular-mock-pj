import type { ProductStatus } from '../constants';
import type { ResponseData } from './common';

export type AuthData = {
  accessToken: string;
};

export type AuthResponse = ResponseData<AuthData>;

export interface ProductSchema {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category: string;
  status: ProductStatus;
}

export type ProductsResponse = ResponseData<ProductSchema[]>;

export type CreateProductRequest = Omit<ProductSchema, 'id'>;
