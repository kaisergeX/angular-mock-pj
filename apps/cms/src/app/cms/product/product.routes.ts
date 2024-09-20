import type { Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductOutletComponent } from './product-outlet/product-outlet.component';
import { ProductService } from './product.service';

export const ProductChildrenRoutes: Routes = [
  {
    path: '',
    providers: [ProductService],
    children: [
      {
        path: '',
        component: ProductComponent,
      },
      {
        path: ':view',
        title: 'Create Product',
        component: ProductOutletComponent,
      },
      {
        path: ':view/:id',
        title: 'Product Management',
        component: ProductOutletComponent,
      },
    ],
  },
];
