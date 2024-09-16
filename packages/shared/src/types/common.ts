// ========================================================================
// =                          General Types                               =                                                                 =
// ========================================================================

export type Primitives = string | number | boolean;
export type ObjectAny = Record<PropertyKey, unknown>;
export type Extends<T, U extends T> = U;
export type ObjectDetail<T> = { [K in keyof T]: T[K] };

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

// ========================================================================
// =                              Utils                                   =                                                                 =
// ========================================================================

export type Payload<T = Record<string, Primitives>> = T & {
  accessToken?: string;
};

export type RequestParams<T = Primitives> = Record<string, T>;

export type ResponseData<T = unknown> = Readonly<{
  message: string;
  statusCode: number;
  data: T;
}>;

export type ResponseError<T = unknown> = Readonly<
  {
    message: string;
    error: string;
    statusCode: number;
  } & T
>;
