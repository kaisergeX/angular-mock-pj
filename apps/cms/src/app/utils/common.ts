import type { HttpErrorResponse } from '@angular/common/http';
import type { ResponseError } from '@repo/shared';

export function processResponseErr(err: HttpErrorResponse): ResponseError {
  const defaultError: ResponseError = {
    statusCode: 500,
    message: 'Internal server error',
    error: 'Server Error',
  };

  if (!err?.error) {
    return defaultError;
  }

  if (typeof err.error === 'object' && 'statusCode' in err.error) {
    const resError = err.error as ResponseError;
    return resError;
  }

  return defaultError;
}

export class ServerError implements Error {
  name: string;
  message: string;
  statusCode: number;
  error: string;

  constructor({ statusCode, message, error }: ResponseError) {
    this.name = error;
    this.error = error;
    this.statusCode = statusCode;
    this.message = message;
  }
}
