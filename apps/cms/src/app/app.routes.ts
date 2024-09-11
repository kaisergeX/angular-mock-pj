import type { Routes } from '@angular/router';
import { CategoryComponent } from './cms/category/category.component';
import { CmsComponent } from './cms/cms.component';
import { ProductComponent } from './cms/product/product.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { loginCanMatch, authCanMatch } from './utils';

export const routes: Routes = [
  { path: '', title: 'Home', redirectTo: 'cms', pathMatch: 'full' },
  { path: 'login', title: 'Login', canMatch: [loginCanMatch], component: LoginComponent },
  {
    path: 'cms',
    title: 'Admin Portal',
    component: CmsComponent,
    canMatch: [authCanMatch],
    children: [
      {
        path: 'product',
        title: 'Product Management',
        component: ProductComponent,
      },
      {
        path: 'category',
        title: 'Category Management',
        component: CategoryComponent,
      },
    ],
  },
  {
    path: '**',
    title: '404 | Not found',
    component: PageNotFoundComponent,
    data: { hideHeader: true },
  },
];
