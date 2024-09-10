import { inject } from '@angular/core';
import { RedirectCommand, Router, type CanMatchFn, type Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CmsComponent } from './cms/cms.component';
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './cms/product/product.component';
import { CategoryComponent } from './cms/category/category.component';

const isAuthenicated = true;

const authCanMatch: CanMatchFn = () => {
  const router = inject(Router);
  // const authService = inject(AuthenticationService);
  // if (!authService.isLoggedIn()) {}

  if (!isAuthenicated) {
    const currentRoute = router.getCurrentNavigation()?.initialUrl.toString();
    return new RedirectCommand(router.parseUrl(`/login?redirect=${currentRoute}`), {
      replaceUrl: true,
    });
  }

  return true;
};

const loginCanMatch: CanMatchFn = () => {
  const router = inject(Router);
  // const authService = inject(AuthenticationService);
  // if (!authService.isLoggedIn()) {}

  if (isAuthenicated) {
    const redirectTo = router.getCurrentNavigation()?.initialUrl.queryParams['redirect'] || 'cms';
    return new RedirectCommand(router.parseUrl(redirectTo), {
      replaceUrl: true,
    });
  }

  return true;
};

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
