import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import type { ResponseData } from '@repo/shared';
import { ToastService } from '~/toast.service';
import type { QueryConfig, SignalQueryReturnType } from '~/types';
import type { ServerError } from '~/utils';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  #httpClient = inject(HttpClient);
  #toastService = inject(ToastService);

  queryFactory<T = unknown>({
    apiPath,
    enable = true,
    onSuccess,
    onError,
  }: QueryConfig<T>): SignalQueryReturnType<T> {
    const isLoading = signal(enable);
    const data = signal<T | undefined>(undefined);

    const fetchQuery = () => {
      this.#httpClient.get<ResponseData<T>>(apiPath).subscribe({
        next: (response) => {
          const resData = response?.data;
          data.set(resData);
          onSuccess?.(resData);
        },
        error: (err: ServerError) => {
          this.#toastService.show({ type: 'error', message: err.message });
          onError?.(err);
          isLoading.set(false);
        },
        complete: () => isLoading.set(false),
      });
    };

    if (enable) {
      fetchQuery();
    }

    return {
      isLoading: isLoading.asReadonly(),
      data: data.asReadonly(),
      refetch: fetchQuery,
    };
  }
}
