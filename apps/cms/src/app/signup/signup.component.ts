import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, type ValidatorFn } from '@angular/forms';
import { AuthLayoutComponent } from '~/components';
import { AuthService } from '~/services';
import type { ToFormBuilder } from '~/types';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerLoader2 } from '@ng-icons/tabler-icons';
import type { SignUpRequest } from '@repo/shared';

type SignupFormGroup = ToFormBuilder<SignUpRequest>;

const validateConfirmPassword: ValidatorFn = (control) => {
  const value = control.value?.trim();
  if (!value) {
    return { msg: 'Please confirm your password' };
  }

  if (control.parent?.get('password')?.value !== value) {
    return { msg: 'Password does not match' };
  }

  return null;
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [AuthLayoutComponent, ReactiveFormsModule, NgIconComponent],
  providers: provideIcons({ tablerLoader2 }),
  templateUrl: './signup.component.html',
  host: {
    class: 'contents',
  },
})
export class SignupComponent {
  #fb = inject(FormBuilder);
  #authService = inject(AuthService);
  isLoading = this.#authService.isLoading;

  form = this.#fb.group<SignupFormGroup>({
    username: this.#fb.control('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
      nonNullable: true,
    }),
    password: this.#fb.control('', {
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(32)],
      nonNullable: true,
    }),
    confirmPassword: this.#fb.control('', {
      validators: validateConfirmPassword,
      nonNullable: true,
    }),
  });

  async handleSignUp() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.form.disable();
    this.#authService.signUp(this.form.value as SignUpRequest, () => this.form.enable());
  }
}
