import type { Extends, Primitives } from './common';
import type { User } from './user';

type LocalStorageSchema = Partial<NonNullable<User>> & {
  accessToken?: string;
  refreshToken?: string;
};

type LocalStorageValueGuard = Primitives | unknown[] | Record<string, unknown> | undefined | null;

/**
 * If a property's value type is not one of type that defined on {@link TLocalStorageValueGuard}, it will NOT be allowed on `TLocalStorage`.
 * ___
 * `test?: bigint` (or `symbol`, `Record<number | symbol, any>`, etc...) will be rejected.
 *
 * "...property 'test' are incompatible. Type 'bigint' is not assignable to type 'TLocalStorageValueGuard'"
 */
export type LocalStorage = Extends<
  Partial<Record<keyof LocalStorageSchema, LocalStorageValueGuard>>,
  LocalStorageSchema
>;

export type SchemaKeys = keyof LocalStorage;
