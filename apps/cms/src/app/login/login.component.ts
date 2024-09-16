import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerApiApp } from '@ng-icons/tabler-icons';
import { newTypedFormData } from '@repo/shared';
import { AuthService } from '~/services';
import type { LoginForm } from './login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIconComponent, FormsModule],
  providers: provideIcons({ tablerApiApp }),
  templateUrl: './login.component.html',
  host: {
    class: 'flex-center flex-col flex-1 gap-4 bg-pattern p-4',
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

    const loginFormData = newTypedFormData<LoginForm>(formElement);
    this.#authService.login(Object.fromEntries(loginFormData.entries()) as LoginForm);
  }
}
