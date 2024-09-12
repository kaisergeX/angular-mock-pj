export const REDIRECT_PARAM = 'redirect';
export const PATH = {
  CMS: 'cms',
  LOGIN: 'login',
  PRODUCT: 'product',
  CATEGORY: 'category',
} as const;

export const DEFAULT = {
  LOCALE: 'en-US',
  CURRENCY: 'USD',
} as const;

export const TABLE_SPECIAL_KEYS = ['action'] as const;
