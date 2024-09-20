import { CommonModule, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerListDetails, tablerEdit } from '@ng-icons/tabler-icons';
import type { CategorySchema } from '@repo/shared';
import { PATH } from '~/constants';
import type { OutletInputs, OutletViewMode } from '~/types';

export type CategoryOutletInputs = OutletInputs<{ id?: CategorySchema['id'] }>;

@Component({
  selector: 'app-category-outlet',
  standalone: true,
  imports: [CommonModule, NgIconComponent, AsyncPipe],
  providers: provideIcons({ tablerListDetails, tablerEdit }),
  templateUrl: './category-outlet.component.html',
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryOutletComponent {
  view = input.required<OutletViewMode>();
  id = input<CategorySchema['id']>(); // undefined means create new product
  #route = inject(Router);

  viewInputs = computed<CategoryOutletInputs>(() => ({
    view: this.view(),
    id: this.id(),
  }));

  constructor() {
    effect(() => {
      if (!this.id() && this.view() === 'detail') {
        this.#route.navigate([PATH.CMS, PATH.CATEGORY], { replaceUrl: true });
        return;
      }
    });
  }

  loadView = computed(async () => {
    switch (this.view()) {
      case 'mutation':
        return import('../category-mutation/category-mutation.component').then(
          (module) => module.CategoryMutationComponent,
        );

      default:
        return import('../category-detail/category-detail.component').then(
          (module) => module.CategoryDetailComponent,
        );
    }
  });

  redirectView(view: OutletViewMode): void {
    this.#route.navigate([PATH.CMS, PATH.CATEGORY, view, this.id()].filter(Boolean));
  }
}
