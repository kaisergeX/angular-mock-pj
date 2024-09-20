import type { ProductStatus } from '../constants';
import type { ResponseData } from './common';
import type { UserSchema } from './system';

export type LoginRequest = Omit<UserSchema, 'id'>;

export type SignUpRequest = LoginRequest & {
  confirmPassword: string;
};

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
  categoryId: CategorySchema['id'];
  categoryName: CategorySchema['name'];
  status: ProductStatus;
}

export type ProductsResponse = ResponseData<ProductSchema[]>;

export type CreateProductRequest = Omit<ProductSchema, 'id' | 'categoryName'>;

export interface CategorySchema {
  id: number;
  name: string;
  description?: string;
}

export type CategoriesResponse = ResponseData<CategorySchema[]>;

export type CreateCategoryRequest = Omit<CategorySchema, 'id'>;
