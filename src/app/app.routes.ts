import type { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CmsComponent } from './cms/cms.component';

export const routes: Routes = [
  { path: '', title: 'Home', redirectTo: 'cms', pathMatch: 'full' },
  {
    path: 'cms',
    title: 'CMS',
    component: CmsComponent,
  },
  {
    path: '**',
    title: '404 | Not found',
    component: PageNotFoundComponent,
    data: { hideHeader: true },
  },
];
