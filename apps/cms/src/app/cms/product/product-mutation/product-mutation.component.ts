import { Component, input } from '@angular/core';
import type { ProductOutletInputs } from '../product-outlet/product-outlet.component';

@Component({
  selector: 'app-product-mutation',
  standalone: true,
  imports: [],
  templateUrl: './product-mutation.component.html',
})
export class ProductMutationComponent {
  view = input.required<ProductOutletInputs['view']>();
  productId = input<ProductOutletInputs['id']>(undefined, { alias: 'id' });
}
