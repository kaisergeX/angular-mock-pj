import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { type CreateProductRequest, type ProductSchema, type ResponseData } from '@repo/shared';
import { ToastService } from '~/toast.service';
import type { SignalMutation, SignalQuery } from '~/types';
import type { ServerError } from '~/utils';

// const dummyProducts: ProductSchema[] = [
//   {
//     id: 1,
//     name: 'Apple MacBook Pro',
//     price: 50_000,
//     category: 'Laptop',
//     status: ProductStatus.ACTIVE,
//   },
//   {
//     id: 2,
//     name: 'Apple Watch',
//     price: 15_000,
//     category: 'Accessories',
//     status: ProductStatus.ACTIVE,
//   },
//   {
//     id: 3,
//     name: 'Microsoft Surface Pro',
//     price: 40_000,
//     category: 'Laptop',
//     status: ProductStatus.INACTIVE,
//   },
//   {
//     id: 4,
//     name: 'iPad',
//     price: 20_000,
//     category: 'Tablet',
//     status: ProductStatus.ACTIVE,
//   },
// ];

const productMutationFactory: SignalMutation<CreateProductRequest> = ({
  onSuccess,
  onError,
} = {}) => {
  const httpClient = inject(HttpClient);
  const toastService = inject(ToastService);
  const isLoading = signal(false);

  return {
    isLoading: isLoading.asReadonly(),
    mutate: (requestData: CreateProductRequest) => {
      isLoading.set(true);
      const sub = httpClient.post('/products', requestData).subscribe({
        next: () => {
          toastService.show({ message: 'Product created' });
          onSuccess?.();
        },
        error: (err: ServerError) => {
          toastService.show({ type: 'error', message: err.message });
          onError?.(err);
        },
        complete: () => {
          isLoading.set(false);
          sub.unsubscribe();
        },
      });
    },
  };
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  #httpClient = inject(HttpClient);
  #toastService = inject(ToastService);

  apiPath = '/products';
  #productData = signal<ProductSchema[]>([]);
  products = this.#productData.asReadonly();

  productsQuery(): SignalQuery<ProductSchema[]> {
    const isLoading = signal(false);
    isLoading.set(true);

    const sub = this.#httpClient.get<ResponseData<ProductSchema[]>>(this.apiPath).subscribe({
      next: (response) => {
        const productList = response?.data;
        if (!Array.isArray(productList)) {
          return;
        }

        this.#productData.set(productList);
      },
      error: (err: ServerError) => this.#toastService.show({ type: 'error', message: err.message }),
      complete: () => {
        isLoading.set(false);
        sub.unsubscribe();
      },
    });

    return {
      isLoading: isLoading.asReadonly(),
      data: this.products,
    };
  }

  createProduct = productMutationFactory;
}
