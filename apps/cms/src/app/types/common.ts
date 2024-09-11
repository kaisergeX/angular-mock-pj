export type Primitives = string | number | boolean;

export type Extends<T, U extends T> = U;

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
