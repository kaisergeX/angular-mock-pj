import { Component, input } from '@angular/core';
import type { ProductOutletInputs } from '../product-outlet/product-outlet.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  view = input.required<ProductOutletInputs['view']>();
  productId = input<ProductOutletInputs['id']>(undefined, { alias: 'id' });
}
