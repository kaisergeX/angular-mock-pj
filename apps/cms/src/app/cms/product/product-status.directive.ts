import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { ProductStatus } from '@repo/shared';

@Directive({
  selector: '[appProductStatus]',
  standalone: true,
})
export class ProductStatusDirective {
  status = input<ProductStatus | undefined, ProductStatus | undefined>(ProductStatus.INACTIVE, {
    transform: (v) => (v === undefined ? ProductStatus.INACTIVE : v),
    alias: 'appProductStatus',
  });
  #elementRef = inject<ElementRef<HTMLElement>>(ElementRef); // access the Host element

  constructor() {
    effect(() => {
      const element = this.#elementRef.nativeElement;
      if (!element) {
        return;
      }

      element.classList.toggle('text-emerald-500', this.status() === ProductStatus.ACTIVE);
      element.classList.toggle('text-zinc-400', this.status() === ProductStatus.INACTIVE);
    });
  }
}
