import { Component, computed, inject, input } from '@angular/core';
import type { ProductOutletInputs } from '../product-outlet/product-outlet.component';
import { ProductService } from '../product.service';
import { LoadingOverlayComponent } from '~/components';
import { CustomCurrencyPipe } from '~/pipes';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [LoadingOverlayComponent, CustomCurrencyPipe],
  templateUrl: './product-detail.component.html',
  host: { class: 'sm:p-4 block flex-1' },
})
export class ProductDetailComponent {
  view = input.required<ProductOutletInputs['view']>();
  productId = input<ProductOutletInputs['id']>(undefined, { alias: 'id' });

  #productService = inject(ProductService);
  productResponse = this.#productService.getProductById(this.productId);
  product = computed(() => this.productResponse().data());
}
