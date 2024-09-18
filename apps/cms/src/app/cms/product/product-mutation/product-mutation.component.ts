import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerCurrencyDollar, tablerLoader2 } from '@ng-icons/tabler-icons';
import { type OptionalToNullable, type CreateProductRequest, ProductStatus } from '@repo/shared';
import { ToastService } from '~/toast.service';
import type { ToFormBuilder } from '~/types';
import { DEFAULT, PATH } from '~/constants';
import type { ProductOutletInputs } from '../product-outlet/product-outlet.component';

type ProductForm = OptionalToNullable<CreateProductRequest>;

@Component({
  selector: 'app-product-mutation',
  standalone: true,
  imports: [ReactiveFormsModule, NgIconComponent],
  providers: provideIcons({ tablerCurrencyDollar, tablerLoader2 }),
  templateUrl: './product-mutation.component.html',
  host: {
    class: 'sm:p-4 block',
  },
})
export class ProductMutationComponent {
  view = input.required<ProductOutletInputs['view']>();
  productId = input<ProductOutletInputs['id']>(undefined, { alias: 'id' });
  #toastService = inject(ToastService);
  #fb = inject(FormBuilder);
  #router = inject(Router);
  loading = false;
  priceUnit = DEFAULT.CURRENCY;

  form = this.#fb.group<ToFormBuilder<ProductForm>>({
    name: this.#fb.control('', { validators: Validators.required, nonNullable: true }),
    price: this.#fb.control(NaN, {
      validators: ({ value }) => {
        if (typeof value !== 'number' || Number.isNaN(value) || value < 100) {
          return { msg: `Price must be greater or equal to ${this.priceUnit}100` };
        }

        return null;
      },
      nonNullable: true,
    }),
    category: this.#fb.control('', { validators: Validators.required, nonNullable: true }),
    status: this.#fb.control(ProductStatus.INACTIVE, {
      validators: Validators.pattern(/^(active|inactive)$/),
      nonNullable: true,
    }),
    description: this.#fb.control(''),
    image: this.#fb.control(''),
  });

  async handleSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    console.log(this.form.value);

    this.loading = true;
    this.form.disable();
    await new Promise((resolve) => setTimeout(resolve, 3000));

    this.loading = false;
    this.#toastService.show({
      message: this.productId() ? 'Product updated' : 'Product created',
      hasCloseBtn: false,
    });

    // this.form.enable();

    this.#router.navigate([PATH.CMS, PATH.PRODUCT]);
  }
}
