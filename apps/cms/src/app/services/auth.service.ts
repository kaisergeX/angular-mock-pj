import { inject, Injectable, signal } from '@angular/core';
import type { LoginForm } from '~/login/login.model';
import { StorageService } from './storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PATH, REDIRECT_PARAM } from '~/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #storage = inject(StorageService);
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #isAuth = signal(this.#storage.get('isAuthenticated') ?? false);
  isAuthenticated = this.#isAuth.asReadonly();

  login(formValues: LoginForm): void {
    this.#storage.setMany({ username: formValues.username, isAuthenticated: true });
    this.#isAuth.set(true);

    const redirectTo = this.#activatedRoute.snapshot.queryParams[REDIRECT_PARAM] || PATH.CMS;
    this.#router.navigateByUrl(redirectTo);
  }

  logout(): void {
    this.#storage.clear();
    this.#isAuth.set(false);
    this.#router.navigateByUrl(`${PATH.LOGIN}?${REDIRECT_PARAM}=${this.#router.url}`);
  }
}
