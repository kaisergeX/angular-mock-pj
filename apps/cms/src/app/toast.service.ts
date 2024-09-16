import { Injectable, signal } from '@angular/core';

type ToastConfig = {
  show: boolean;
  message?: string;
  type?: 'success' | 'error';
  autoClose?: number | false;
  hasCloseBtn?: boolean;
};

const initToastConfig: ToastConfig = {
  show: false,
  type: 'success',
  autoClose: 4000,
  hasCloseBtn: false,
};

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  #toastConfig = signal<ToastConfig>(initToastConfig);
  config = this.#toastConfig.asReadonly();

  show(config: Omit<ToastConfig, 'show'>): void {
    this.#toastConfig.set({ ...initToastConfig, ...config, show: true });
  }

  hide(): void {
    this.#toastConfig.update((current) => ({ ...current, show: false }));

    setTimeout(() => {
      // reset config after discrete closing animation completed
      this.#toastConfig.set(initToastConfig);
    }, 200);
  }
}
