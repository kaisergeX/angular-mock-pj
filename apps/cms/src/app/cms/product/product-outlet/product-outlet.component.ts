import { Component, computed, effect, inject, input } from '@angular/core';
import type { Product } from '../product.model';
import { Router } from '@angular/router';
import { PATH } from '~/constants';
import { AsyncPipe, CommonModule } from '@angular/common';
import type { OutletInputs, OutletViewMode } from '~/types';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerEdit, tablerListDetails } from '@ng-icons/tabler-icons';

export type ProductOutletInputs = OutletInputs<{ id?: Product['id'] }>;

@Component({
  selector: 'app-product-outlet',
  standalone: true,
  imports: [CommonModule, NgIconComponent, AsyncPipe],
  providers: provideIcons({ tablerListDetails, tablerEdit }),
  templateUrl: './product-outlet.component.html',
})
export class ProductOutletComponent {
  view = input.required<OutletViewMode>();
  id = input<Product['id']>(); // undefined means create new product
  #route = inject(Router);

  viewInputs = computed<ProductOutletInputs>(() => ({
    view: this.view(),
    id: this.id(),
  }));

  constructor() {
    effect(() => {
      if (!this.id() && this.view() === 'detail') {
        this.#route.navigate([PATH.CMS, PATH.PRODUCT], { replaceUrl: true });
        return;
      }
    });
  }

  loadView = computed(async () => {
    switch (this.view()) {
      case 'mutation':
        return import('../product-mutation/product-mutation.component').then(
          (module) => module.ProductMutationComponent,
        );

      default:
        return import('../product-detail/product-detail.component').then(
          (module) => module.ProductDetailComponent,
        );
    }
  });

  redirectView(view: OutletViewMode): void {
    this.#route.navigate([PATH.CMS, PATH.PRODUCT, view, this.id()].filter(Boolean));
  }
}
