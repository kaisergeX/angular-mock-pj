import type { TypedFormData, TypedFormDataValue } from '~/types';

export function newTypedFormData<T extends Record<string, TypedFormDataValue>>(
  form?: HTMLFormElement | null,
): TypedFormData<T> {
  return new FormData(form || undefined) as unknown as TypedFormData<T>;
}
