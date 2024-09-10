import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerSearch } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIconComponent],
  providers: [provideIcons({ tablerSearch })],
  templateUrl: './product.component.html',
  host: {
    class: 'p-4 block overflow-hidden',
  },
})
export class ProductComponent {}
