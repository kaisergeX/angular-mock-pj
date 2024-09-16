import { inject, Injectable, signal } from '@angular/core';
import type { LoginForm } from '~/login/login.model';
import { StorageService } from './storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PATH, REDIRECT_PARAM } from '~/constants';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '~/toast.service';
import type { AuthData, ResponseData } from '@repo/shared';
import type { ServerError } from '~/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // #destroyRef = inject(DestroyRef);
  #httpClient = inject(HttpClient);
  #toastService = inject(ToastService);
  #storage = inject(StorageService);
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  #isAuth = signal(this.#storage.get('isAuthenticated') ?? false);
  isAuthenticated = this.#isAuth.asReadonly();
  isLoading = signal(false);

  login(formValues: LoginForm): void {
    this.isLoading.set(true);
    const sub = this.#httpClient
      .post<ResponseData<AuthData>>('/auth/signin', formValues)
      .subscribe({
        next: (response) => {
          const resData = response?.data;
          if (!resData?.accessToken) {
            throw new Error('Invalid response');
          }
          this.#storage.setMany({
            username: formValues.username,
            isAuthenticated: true,
            accessToken: resData.accessToken,
          });
          this.#isAuth.set(true);

          const redirectTo = this.#activatedRoute.snapshot.queryParams[REDIRECT_PARAM] || PATH.CMS;
          this.#router.navigateByUrl(redirectTo);
        },
        error: (err: ServerError) =>
          this.#toastService.show({ type: 'error', message: err.message }),
        complete: () => {
          this.isLoading.set(false);
          sub.unsubscribe();
        },
      });
  }

  logout(): void {
    this.#storage.clear();
    this.#isAuth.set(false);

    const currentUrl = this.#router.url;
    if (currentUrl.includes(PATH.LOGIN)) {
      return;
    }

    const redirectUrl =
      new URLSearchParams(currentUrl.split('?')[1]).get(REDIRECT_PARAM) || // if current url has redirect param, then reuse it
      currentUrl;
    this.#router.navigate([PATH.LOGIN], { queryParams: { [REDIRECT_PARAM]: redirectUrl } });
  }
}
