import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, type Signal } from '@angular/core';
import { type CreateProductRequest, type ProductSchema } from '@repo/shared';
import { QueryService } from '~/services';
import { ToastService } from '~/toast.service';
import type { QueryCallbacks, SignalMutation, SignalQueryReturnType } from '~/types';
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

type ProductMutationReq = CreateProductRequest & { id?: ProductSchema['id'] };

const productMutationFactory: SignalMutation<ProductMutationReq> = ({
  onSuccess,
  onError,
} = {}) => {
  const httpClient = inject(HttpClient);
  const toastService = inject(ToastService);
  const isLoading = signal(false);

  return {
    isLoading: isLoading.asReadonly(),
    mutate: ({ id: productId, ...requestData }) => {
      const isUpdating = productId !== undefined;
      isLoading.set(true);

      (isUpdating
        ? httpClient.patch(`/products/${productId}`, requestData)
        : httpClient.post('/products', requestData)
      ).subscribe({
        next: () => {
          toastService.show({ message: `Product ${isUpdating ? 'updated' : 'created'}` });
          onSuccess?.();
        },
        error: (err: ServerError) => {
          toastService.show({ type: 'error', message: err.message });
          isLoading.set(false);
          onError?.(err);
        },
        complete: () => isLoading.set(false),
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
  #queryService = inject(QueryService);
  apiPath = '/products';

  productsQuery(): SignalQueryReturnType<ProductSchema[]> {
    return this.#queryService.queryFactory<ProductSchema[]>({ apiPath: this.apiPath });
  }

  getProductById(id: Signal<ProductSchema['id'] | undefined>) {
    return computed<SignalQueryReturnType<ProductSchema>>(() =>
      this.#queryService.queryFactory<ProductSchema>({
        apiPath: `${this.apiPath}/${id()}`,
        enable: id() !== undefined,
      }),
    );
  }

  productMutation = productMutationFactory;

  deleteProduct(productId: ProductSchema['id'], { onSuccess, onError }: QueryCallbacks) {
    this.#httpClient.delete(`${this.apiPath}/${productId}`).subscribe({
      next: () => this.#toastService.show({ message: 'Product deleted' }),
      error: (err: ServerError) => {
        this.#toastService.show({ type: 'error', message: err.message });
        onError?.(err);
      },
      complete: onSuccess,
    });
  }
}
