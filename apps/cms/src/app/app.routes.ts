import type { Routes } from '@angular/router';
import { CmsComponent } from './cms/cms.component';
import { LoginComponent } from './login/login.component';
import { loginCanMatch, authCanMatch } from './utils';
import { PATH } from './constants';

export const routes: Routes = [
  { path: '', title: 'Home', redirectTo: PATH.CMS, pathMatch: 'full' },
  { path: PATH.LOGIN, title: 'Login', canMatch: [loginCanMatch], component: LoginComponent },
  {
    path: PATH.SIGN_UP,
    title: 'Sign Up',
    canMatch: [loginCanMatch],
    loadComponent: () => import('./signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: PATH.CMS,
    title: 'Admin Portal',
    component: CmsComponent,
    data: { showHeader: true },
    canMatch: [authCanMatch],
    children: [
      {
        path: PATH.PRODUCT,
        title: 'Product Management',
        loadChildren: () =>
          import('./cms/product/product.routes').then((m) => m.ProductChildrenRoutes),
      },
      {
        path: PATH.CATEGORY,
        title: 'Category Management',
        loadChildren: () =>
          import('./cms/category/category.routes').then((m) => m.CategoryChildrenRoutes),
      },
    ],
  },
  {
    path: '**',
    title: '404 | Not found',
    loadComponent: () =>
      import('./page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent),
    data: { showHeader: true },
  },
];
