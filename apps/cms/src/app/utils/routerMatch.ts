import { inject } from '@angular/core';
import { type CanMatchFn, Router, RedirectCommand } from '@angular/router';
import { AuthService } from '~/services/auth.service';

export const authCanMatch: CanMatchFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    const currentRoute = router.getCurrentNavigation()?.initialUrl.toString();
    return new RedirectCommand(router.parseUrl(`/login?redirect=${currentRoute}`), {
      replaceUrl: true,
    });
  }

  return true;
};

export const loginCanMatch: CanMatchFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    const redirectTo = router.getCurrentNavigation()?.initialUrl.queryParams['redirect'] || 'cms';
    return new RedirectCommand(router.parseUrl(redirectTo), {
      replaceUrl: true,
    });
  }

  return true;
};
