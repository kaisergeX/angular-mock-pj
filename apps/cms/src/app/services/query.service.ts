import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, type Signal } from '@angular/core';
import type { ResponseData } from '@repo/shared';
import { ToastService } from '~/toast.service';
import type { QueryConfig } from '~/types';
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
  }: QueryConfig<T>): { isLoading: Signal<boolean> } {
    const isLoading = signal(true);

    if (!enable) {
      return { isLoading: isLoading.asReadonly() };
    }

    const sub = this.#httpClient.get<ResponseData<T>>(apiPath).subscribe({
      next: (response) => {
        const resData = response?.data;
        onSuccess?.(resData);
      },
      error: (err: ServerError) => {
        this.#toastService.show({ type: 'error', message: err.message });
        onError?.(err);
      },
      complete: () => {
        isLoading.set(false);
        sub.unsubscribe();
      },
    });

    return { isLoading: isLoading.asReadonly() };
  }
}
