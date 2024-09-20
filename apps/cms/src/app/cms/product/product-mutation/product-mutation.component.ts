import { Component, computed, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerCurrencyDollar, tablerLoader2 } from '@ng-icons/tabler-icons';
import { type OptionalToNullable, type CreateProductRequest, ProductStatus } from '@repo/shared';
import type { ToFormBuilder } from '~/types';
import { DEFAULT, PATH } from '~/constants';
import type { ProductOutletInputs } from '../product-outlet/product-outlet.component';
import { ProductService } from '../product.service';
import { FormControlComponent, LoadingOverlayComponent } from '~/components';

type ProductForm = OptionalToNullable<CreateProductRequest>;

const initFormValues: ProductForm = {
  name: '',
  price: NaN,
  description: '',
  image: '',
  category: '',
  status: ProductStatus.INACTIVE,
};

@Component({
  selector: 'app-product-mutation',
  standalone: true,
  imports: [ReactiveFormsModule, NgIconComponent, FormControlComponent, LoadingOverlayComponent],
  providers: provideIcons({ tablerCurrencyDollar, tablerLoader2 }),
  templateUrl: './product-mutation.component.html',
  host: {
    class: 'sm:p-4 block',
  },
})
export class ProductMutationComponent {
  view = input.required<ProductOutletInputs['view']>();
  productId = input<ProductOutletInputs['id']>(undefined, { alias: 'id' });
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #productService = inject(ProductService);

  productDetail = this.#productService.getProductById(this.productId);

  defaultFormValues = computed(() => {
    const { id: _, ...productData } = { ...initFormValues, ...this.productDetail().data() };
    this.form.setValue(productData);
    return { isLoading: this.productDetail().isLoading(), data: productData };
  });

  productMutation = this.#productService.productMutation({
    onSuccess: () => {
      this.form.reset(this.defaultFormValues().data);
      this.#router.navigate([PATH.CMS, PATH.PRODUCT]);
    },
    onError: () => this.form.enable(),
  });

  isLoading = computed(
    () => this.defaultFormValues().isLoading || this.productMutation.isLoading(),
  );

  priceUnit = DEFAULT.CURRENCY;

  form = this.#fb.group<ToFormBuilder<ProductForm>>({
    name: this.#fb.control(initFormValues.name, {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)],
      nonNullable: true,
    }),
    price: this.#fb.control(initFormValues.price, {
      validators: ({ value }) => {
        if (typeof value !== 'number' || Number.isNaN(value) || value < 100) {
          return { msg: `Price must be greater or equal to ${this.priceUnit}100` };
        }

        return null;
      },
      nonNullable: true,
    }),
    category: this.#fb.control(initFormValues.category, {
      validators: Validators.required,
      nonNullable: true,
    }),
    status: this.#fb.control(initFormValues.status, {
      validators: Validators.pattern(/^(active|inactive)$/),
      nonNullable: true,
    }),
    description: this.#fb.control(initFormValues.description),
    image: this.#fb.control(initFormValues.image),
  });

  async handleSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const mutationData = this.form.value as CreateProductRequest;
    this.form.disable();
    this.productMutation.mutate({ ...mutationData, id: this.productId() });
  }
}
