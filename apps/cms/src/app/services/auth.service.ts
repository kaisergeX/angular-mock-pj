import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #isAuth = signal(true);
  isAuthenticated = this.#isAuth.asReadonly();

  // constructor() {}

  login(): void {
    this.#isAuth.set(true);
  }

  logout(): void {
    this.#isAuth.set(false);
  }
}
