import type { TypedFormData, TypedFormDataValue } from '~/types';

export function newTypedFormData<T extends Record<string, TypedFormDataValue>>(
  form?: HTMLFormElement | null,
): TypedFormData<T> {
  return new FormData(form || undefined) as unknown as TypedFormData<T>;
}

export const safeAnyToNumber = <T = unknown>(
  inputVal: Exclude<T, (...args: never) => unknown>,
  fallbackNum = 0,
): { result: number; success: boolean } => {
  if (inputVal === null || typeof inputVal === 'symbol') {
    return { result: fallbackNum, success: false };
  }

  const toNumber = Number(inputVal);
  return { result: isNaN(toNumber) ? fallbackNum : toNumber, success: true };
};
