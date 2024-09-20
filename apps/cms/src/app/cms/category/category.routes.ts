import type { Routes } from '@angular/router';
import { CategoryComponent } from './category.component';
import { CategoryOutletComponent } from './category-outlet/category-outlet.component';

export const CategoryChildrenRoutes: Routes = [
  {
    path: '',
    component: CategoryComponent,
  },
  {
    path: ':view',
    title: 'Create Category',
    component: CategoryOutletComponent,
  },
  {
    path: ':view/:id',
    title: 'Category Management',
    component: CategoryOutletComponent,
  },
];
