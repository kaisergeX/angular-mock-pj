import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, type Signal } from '@angular/core';
import type { CategorySchema, CreateCategoryRequest } from '@repo/shared';
import { API_PATH } from '~/constants';
import { QueryService } from '~/services';
import { ToastService } from '~/toast.service';
import type { SignalMutation, SignalQueryReturnType } from '~/types';
import type { ServerError } from '~/utils';

type CategoryMutationReq = CreateCategoryRequest & { id?: CategorySchema['id'] };

const mutationFactory: SignalMutation<CategoryMutationReq> = ({ onSuccess, onError } = {}) => {
  const httpClient = inject(HttpClient);
  const toastService = inject(ToastService);
  const isLoading = signal(false);

  return {
    isLoading: isLoading.asReadonly(),
    mutate: ({ id: productId, ...requestData }) => {
      const isUpdating = productId !== undefined;
      isLoading.set(true);

      (isUpdating
        ? httpClient.patch(`${API_PATH.CATEGORY}/${productId}`, requestData)
        : httpClient.post(API_PATH.CATEGORY, requestData)
      ).subscribe({
        next: () => {
          toastService.show({ message: `Category ${isUpdating ? 'updated' : 'created'}` });
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
export class CategoryService {
  #queryService = inject(QueryService);

  categoriesQuery(): SignalQueryReturnType<CategorySchema[]> {
    return this.#queryService.queryFactory<CategorySchema[]>({ apiPath: API_PATH.CATEGORY });
  }

  categoryMutation = mutationFactory;

  getById(id: Signal<CategorySchema['id'] | undefined>) {
    return computed<SignalQueryReturnType<CategorySchema>>(() =>
      this.#queryService.queryFactory<CategorySchema>({
        apiPath: `${API_PATH.CATEGORY}/${id()}`,
        enable: id() !== undefined,
      }),
    );
  }
}
