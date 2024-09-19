import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, type Signal } from '@angular/core';
import { type CreateProductRequest, type ProductSchema } from '@repo/shared';
import { QueryService } from '~/services';
import { ToastService } from '~/toast.service';
import type { SignalMutation, SignalQueryReturnType } from '~/types';
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

const productMutationFactory: SignalMutation<
  CreateProductRequest & { id?: ProductSchema['id'] }
> = ({ onSuccess, onError } = {}) => {
  const httpClient = inject(HttpClient);
  const toastService = inject(ToastService);
  const isLoading = signal(false);

  return {
    isLoading: isLoading.asReadonly(),
    mutate: ({ id: productId, ...requestData }) => {
      const isUpdating = productId !== undefined;
      isLoading.set(true);

      if (isUpdating) {
        const sub = httpClient.patch(`/products/${productId}`, requestData).subscribe({
          next: () => {
            toastService.show({ message: 'Product updated' });
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

        return;
      }

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
  #queryService = inject(QueryService);
  apiPath = '/products';
  #productList = signal<ProductSchema[]>([]);
  products = this.#productList.asReadonly();

  productsQuery(): SignalQueryReturnType<ProductSchema[]> {
    const { isLoading } = this.#queryService.queryFactory<ProductSchema[]>({
      apiPath: this.apiPath,
      onSuccess: (resData) => {
        if (!Array.isArray(resData)) {
          return;
        }

        this.#productList.set(resData);
      },
    });

    return { isLoading, data: this.products };
  }

  getProductById(id: Signal<ProductSchema['id'] | undefined>) {
    const productData = signal<ProductSchema | undefined>(undefined);

    return computed<SignalQueryReturnType<ProductSchema>>(() => {
      const productId = id();
      const { isLoading } = this.#queryService.queryFactory<ProductSchema>({
        apiPath: `${this.apiPath}/${productId}`,
        enable: productId !== undefined,
        onSuccess: (productDetail) => productData.set(productDetail),
      });

      return { isLoading, data: productData.asReadonly() };
    });
  }

  productMutation = productMutationFactory;
}
