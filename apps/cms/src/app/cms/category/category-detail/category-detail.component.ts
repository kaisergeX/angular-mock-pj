import { Component, computed, inject, input } from '@angular/core';
import { LoadingOverlayComponent } from '~/components';
import type { CategoryOutletInputs } from '../category-outlet/category-outlet.component';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [LoadingOverlayComponent],
  templateUrl: './category-detail.component.html',
  host: { class: 'sm:p-4 block flex-1' },
})
export class CategoryDetailComponent {
  view = input.required<CategoryOutletInputs['view']>();
  categoryId = input<CategoryOutletInputs['id']>(undefined, { alias: 'id' });

  #categoryService = inject(CategoryService);
  categoryResponse = this.#categoryService.getById(this.categoryId);
  category = computed(() => this.categoryResponse().data());
}
