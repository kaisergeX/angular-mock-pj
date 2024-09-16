import { type HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '~/services';
import { processResponseErr, ServerError } from '~/utils';

function processBaseUrl(url: string): string {
  if (url.startsWith('http')) {
    return url;
  }

  return environment.apiUrl + url;
}

export const httpInterceptor: HttpInterceptorFn = (request, next) => {
  const storage = inject(StorageService);
  const accessToken = storage.get('accessToken');

  const req = request.clone({
    url: processBaseUrl(request.url),
    headers: accessToken
      ? request.headers.set('Authorization', `Bearer ${accessToken}`)
      : request.headers,
  });

  return next(req).pipe(
    // map((event) => {
    //   if (event instanceof HttpResponse) {
    //     const resData = event.body as ResponseData;
    //     if ('data' in resData) {
    //       return event.clone({ body: resData.data });
    //     }
    //   }

    //   return event;
    // }),
    catchError((err: HttpErrorResponse) => {
      const resError = processResponseErr(err);
      switch (resError.statusCode) {
        case 401: {
          storage.clear();
          break;
        }
        default:
          break;
      }

      return throwError(() => new ServerError(resError));
    }),
  );
};
