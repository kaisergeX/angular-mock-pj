import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { newTypedFormData, type LoginRequest } from '@repo/shared';
import { AuthService } from '~/services';
import { AuthLayoutComponent } from '~/components';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, AuthLayoutComponent],
  templateUrl: './login.component.html',
  host: {
    class: 'contents',
  },
})
export class LoginComponent {
  #authService = inject(AuthService);

  handleSubmit(event: SubmitEvent): void {
    const formElement = event.target as HTMLFormElement;
    if (!formElement.checkValidity()) {
      event.preventDefault();
      return;
    }

    const loginFormData = newTypedFormData<LoginRequest>(formElement);
    this.#authService.login(Object.fromEntries(loginFormData.entries()) as LoginRequest);
  }
}
