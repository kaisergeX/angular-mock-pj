import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { ProductOutletInputs } from '../product-outlet/product-outlet.component';
import { ProductService } from '../product.service';
import { LoadingOverlayComponent } from '~/components';
import { CustomCurrencyPipe } from '~/pipes';
import { RouterLink } from '@angular/router';
import { PATH } from '~/constants';
import { ProductStatusDirective } from '../product-status.directive';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [LoadingOverlayComponent, CustomCurrencyPipe, RouterLink, ProductStatusDirective],
  templateUrl: './product-detail.component.html',
  host: { class: 'sm:p-4 block flex-1' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  view = input.required<ProductOutletInputs['view']>();
  productId = input<ProductOutletInputs['id']>(undefined, { alias: 'id' });
  ROUTE_PATH = PATH;

  #productService = inject(ProductService);
  productResponse = this.#productService.getProductById(this.productId);
  product = computed(() => this.productResponse().data());
}
