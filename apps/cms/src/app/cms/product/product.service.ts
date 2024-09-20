import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, type Signal } from '@angular/core';
import type { CreateProductRequest, ProductSchema } from '@repo/shared';
import { API_PATH } from '~/constants';
import { QueryService } from '~/services';
import { ToastService } from '~/toast.service';
import type { QueryCallbacks, SignalMutation, SignalQueryReturnType } from '~/types';
import type { ServerError } from '~/utils';

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
        ? httpClient.patch(`${API_PATH.PRODUCTS}/${productId}`, requestData)
        : httpClient.post(API_PATH.PRODUCTS, requestData)
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

@Injectable()
export class ProductService {
  #httpClient = inject(HttpClient);
  #toastService = inject(ToastService);
  #queryService = inject(QueryService);

  productsQuery(): SignalQueryReturnType<ProductSchema[]> {
    return this.#queryService.queryFactory<ProductSchema[]>({ apiPath: API_PATH.PRODUCTS });
  }

  getProductById(id: Signal<ProductSchema['id'] | undefined>) {
    return computed<SignalQueryReturnType<ProductSchema>>(() =>
      this.#queryService.queryFactory<ProductSchema>({
        apiPath: `${API_PATH.PRODUCTS}/${id()}`,
        enable: id() !== undefined,
      }),
    );
  }

  productMutation = productMutationFactory;

  deleteProduct(productId: ProductSchema['id'], { onSuccess, onError }: QueryCallbacks) {
    this.#httpClient.delete(`${API_PATH.PRODUCTS}/${productId}`).subscribe({
      next: () => this.#toastService.show({ message: 'Product deleted' }),
      error: (err: ServerError) => {
        this.#toastService.show({ type: 'error', message: err.message });
        onError?.(err);
      },
      complete: onSuccess,
    });
  }
}
