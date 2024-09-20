import { Component, computed, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerLoader2 } from '@ng-icons/tabler-icons';
import type { CreateCategoryRequest, OptionalToNullable } from '@repo/shared';
import { FormControlComponent, LoadingOverlayComponent } from '~/components';
import { CategoryService } from '../category.service';
import type { CategoryOutletInputs } from '../category-outlet/category-outlet.component';
import type { ToFormBuilder } from '~/types';
import { PATH } from '~/constants';

type CategoryForm = OptionalToNullable<CreateCategoryRequest>;

const initFormValues: CategoryForm = {
  name: '',
  description: '',
};

@Component({
  selector: 'app-category-mutation',
  standalone: true,
  imports: [ReactiveFormsModule, NgIconComponent, FormControlComponent, LoadingOverlayComponent],
  providers: provideIcons({ tablerLoader2 }),
  templateUrl: './category-mutation.component.html',
  host: {
    class: 'sm:p-4 block',
  },
})
export class CategoryMutationComponent {
  view = input.required<CategoryOutletInputs['view']>();
  categoryId = input<CategoryOutletInputs['id']>(undefined, { alias: 'id' });
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #categoryService = inject(CategoryService);

  categoryDetail = this.#categoryService.getById(this.categoryId);

  defaultFormValues = computed(() => {
    const { id: _, ...data } = { ...initFormValues, ...this.categoryDetail().data() };
    this.form.setValue(data);
    return { isLoading: this.categoryDetail().isLoading(), data };
  });

  categoryMutation = this.#categoryService.categoryMutation({
    onSuccess: () => {
      this.form.reset(this.defaultFormValues().data);
      this.#router.navigate([PATH.CMS, PATH.CATEGORY]);
    },
    onError: () => this.form.enable(),
  });

  isLoading = computed(
    () => this.defaultFormValues().isLoading || this.categoryMutation.isLoading(),
  );

  form = this.#fb.group<ToFormBuilder<CategoryForm>>({
    name: this.#fb.control(initFormValues.name, {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)],
      nonNullable: true,
    }),
    description: this.#fb.control(initFormValues.description),
  });

  async handleSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const mutationData = this.form.value as CreateCategoryRequest;
    this.form.disable();
    this.categoryMutation.mutate({ ...mutationData, id: this.categoryId() });
  }
}
