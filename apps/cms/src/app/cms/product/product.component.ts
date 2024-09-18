import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerEdit, tablerPlus, tablerSearch, tablerTrash } from '@ng-icons/tabler-icons';
import { type ObjectDetail, type ProductSchema } from '@repo/shared';
import { TableComponent } from '~/components/table/table.component';
import type { TableCellContext, TableConfig } from '~/types';
import { RouterLink } from '@angular/router';
import { ProductService } from './product.service';
import { LoadingOverlayComponent } from '~/components';

type Product = ObjectDetail<ProductSchema>;

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIconComponent, TableComponent, RouterLink, LoadingOverlayComponent],
  providers: provideIcons({ tablerSearch, tablerEdit, tablerTrash, tablerPlus }),
  templateUrl: './product.component.html',
  host: {
    class: 'sm:p-4 flex-1 overflow-hidden',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  statusTemplate = viewChild.required<TemplateRef<TableCellContext<Product>>>('customStatus');
  actionTemplate = viewChild.required<TemplateRef<TableCellContext<Product>>>('customAction');
  #productService = inject(ProductService);

  productsQuery = this.#productService.productsQuery();

  tableConfig = computed<TableConfig<Product>>(() => ({
    columns: [
      { key: 'name', header: 'Name' },
      {
        key: 'price',
        header: 'Price',
        type: 'currency',
        // currencyOptions: { currency: 'VND', locale: 'vi' },
      },
      { key: 'category', header: 'Category' },
      { key: 'status', header: 'Status', align: 'center', template: this.statusTemplate },
      {
        key: 'action',
        header: 'Actions',
        className: 'flex-center gap-4',
        template: this.actionTemplate,
      },
    ],
    data: this.productsQuery.data(),
  }));

  deleteProduct(id: Product['id']): void {
    console.log('Delete product with id:', id);
  }
}
