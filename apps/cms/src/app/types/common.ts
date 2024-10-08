import type { Signal, TemplateRef } from '@angular/core';
import type { FormControl } from '@angular/forms';
import type { ObjectAny } from '@repo/shared';
import type { TABLE_SPECIAL_KEYS } from '~/constants';
import type { ServerError } from '~/utils';

export type ToFormBuilder<TSchema extends ObjectAny> = {
  [K in keyof TSchema]: FormControl<TSchema[K]>;
};

export type CurrencyPipeOptions = {
  isDiscount?: boolean;
  locale?: string;
  currency?: string;
};

export type QueryCallbacks<T = unknown> = {
  onSuccess?: (data?: T) => void;
  onError?: (err: ServerError) => void;
};
export type QueryConfig<T = unknown> = {
  apiPath: string;
  /** @default true */
  enable?: boolean;
} & QueryCallbacks<T>;

export type SignalQueryReturnType<T = unknown> = Readonly<{
  isLoading: Signal<boolean>;
  data: Signal<T | undefined>;
  refetch: () => void;
}>;
export type SignalQuery<TPayload = unknown> = (
  config: QueryConfig,
) => SignalQueryReturnType<TPayload>;

export type SignalMutationReturnType<T = unknown> = Readonly<{
  isLoading: Signal<boolean>;
  mutate: (requestData: T) => void;
}>;
export type SignalMutation<TPayload = unknown> = (
  config?: QueryCallbacks<TPayload>,
) => SignalMutationReturnType<TPayload>;

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
  data: Signal<TData[] | undefined>;
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
