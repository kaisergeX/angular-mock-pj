import { Pipe, type PipeTransform } from '@angular/core';
import { safeAnyToNumber } from '@repo/shared';
import { DEFAULT } from '~/constants';
import type { CurrencyPipeOptions } from '~/types';

@Pipe({
  name: 'customCurrency',
  standalone: true,
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(
    price: unknown,
    {
      isDiscount = false,
      locale = DEFAULT.LOCALE,
      currency = DEFAULT.CURRENCY,
    }: CurrencyPipeOptions = {},
  ): string {
    if (typeof price === 'function') {
      return '';
    }

    let processedPrice = safeAnyToNumber(price).result;
    if (isDiscount && processedPrice >= 0) {
      processedPrice = processedPrice * -1;
    }

    try {
      return processedPrice.toLocaleString(locale, { style: 'currency', currency });
    } catch (error) {
      return processedPrice.toLocaleString(DEFAULT.LOCALE, {
        style: 'currency',
        currency: DEFAULT.CURRENCY,
      });
    }
  }
}
