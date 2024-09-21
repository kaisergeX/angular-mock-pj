import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ResponseData } from '@repo/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseData<T>>
{
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseData<T>> {
    return next
      .handle()
      .pipe(map((data) => ({ data, message: 'Success', statusCode: 200 })));
  }
}
