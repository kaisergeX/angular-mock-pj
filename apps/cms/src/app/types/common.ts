import type { TemplateRef } from '@angular/core';
import type { FormControl } from '@angular/forms';
import type { TABLE_SPECIAL_KEYS } from '~/constants';

// ========================================================================
// =                          General Types                               =                                                                 =
// ========================================================================

export type Primitives = string | number | boolean;
export type ObjectAny = Record<PropertyKey, unknown>;
export type Extends<T, U extends T> = U;
type ObjectDetail<T extends ObjectAny> = { [K in keyof T]: T[K] };

/** Make provided keys required in an object type */
export type RequiredByKeys<T, K extends keyof T> = ObjectDetail<T & { [P in K]-?: T[P] }>;

/** Get optional keys of an object type */
export type UndefinedKeys<T> = {
  [P in keyof T]-?: undefined extends T[P] ? P : never;
}[keyof T];
export type PickOptionals<T> = Pick<T, UndefinedKeys<T>>;
type UndefinedToNull<T> = T extends undefined ? null : T;
export type OptionalToNullable<T extends ObjectAny> = {
  [K in keyof T]-?: UndefinedToNull<T[K]>;
};
export type ToFormBuilder<TSchema extends ObjectAny> = {
  [K in keyof TSchema]: FormControl<TSchema[K]>;
};

// ========================================================================
// =                              Utils                                   =                                                                 =
// ========================================================================

export type Payload<T = Record<string, Primitives>> = T & {
  accessToken?: string;
};

export type RequestParams<T = Primitives> = Record<string, T>;
export type ResponseData<T = unknown> = Readonly<
  {
    message: string;
    responseCode: number;
  } & T
>;
export type ResponseError<T = unknown> = Readonly<
  {
    path: string;
    timestamp: string;
    traceId: string;
  } & T
>;

export type CurrencyPipeOptions = {
  isDiscount?: boolean;
  locale?: string;
  currency?: string;
};

// ========================================================================
// =                              Layout                                  =
// ========================================================================

export type OutletViewMode = 'mutation' | 'detail';
export type OutletInputs<TData extends ObjectAny = ObjectAny> = {
  view: OutletViewMode;
} & TData;

export type TableColumn<TData extends ObjectAny> = Readonly<{
  key: keyof TData | (typeof TABLE_SPECIAL_KEYS)[number];
  header: string;
  /** @default 'left' */
  className?: string;
  align?: 'left' | 'center' | 'right';
  template?: () => TemplateRef<TableCellContext<TData>>;
  /** @default 'normal' */
  type?: 'header' | 'currency' | 'normal';
  currencyOptions?: CurrencyPipeOptions;
}>;

export type TableConfig<TData extends ObjectAny = ObjectAny> = {
  columns: TableColumn<TData>[];
  data: TData[];
};

export type TableCellContext<
  TData extends ObjectAny,
  TKey extends TableColumn<TData>['key'] = TableColumn<TData>['key'],
> = {
  get $implicit(): {
    record: TData;
    /** Defined column key including {@link TABLE_SPECIAL_KEYS} */
    key: TKey;
    /**
     * Related record's value by column key
     * ___
     * `undefined` in special columns (ref: {@link TABLE_SPECIAL_KEYS})
     */
    value?: TData[keyof TData];
  };
};
