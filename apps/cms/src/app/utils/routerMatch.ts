import { inject } from '@angular/core';
import { type CanMatchFn, Router, RedirectCommand } from '@angular/router';
import { PATH, REDIRECT_PARAM } from '~/configs';
import { AuthService } from '~/services';

export const authCanMatch: CanMatchFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    const currentRoute = router.getCurrentNavigation()?.initialUrl.toString();
    return new RedirectCommand(
      router.parseUrl(`/${PATH.LOGIN}?${REDIRECT_PARAM}=${currentRoute}`),
      {
        replaceUrl: true,
      },
    );
  }

  return true;
};

export const loginCanMatch: CanMatchFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    const redirectTo =
      router.getCurrentNavigation()?.initialUrl.queryParams[REDIRECT_PARAM] || PATH.CMS;
    return new RedirectCommand(router.parseUrl(redirectTo), {
      replaceUrl: true,
    });
  }

  return true;
};
