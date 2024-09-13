import { ChangeDetectionStrategy, Component, TemplateRef, viewChild } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerEdit, tablerSearch, tablerTrash } from '@ng-icons/tabler-icons';
import type { Product } from './product.model';
import { TableComponent } from '~/components/table/table.component';
import type { TableCellContext, TableConfig } from '~/types';
import { RouterLink } from '@angular/router';

const products: Product[] = [
  {
    id: 1,
    name: 'Apple MacBook Pro',
    price: 50_000_000,
    category: 'Laptop',
    status: 'active',
  },
  {
    id: 2,
    name: 'Apple Watch',
    price: 15_000_000,
    category: 'Accessories',
    status: 'active',
  },
  {
    id: 3,
    name: 'Microsoft Surface Pro',
    price: 40_000_000,
    category: 'Laptop',
    status: 'inactive',
  },
  {
    id: 4,
    name: 'iPad',
    price: 20_000_000,
    category: 'Tablet',
    status: 'active',
  },
];

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIconComponent, TableComponent, RouterLink],
  providers: provideIcons({ tablerSearch, tablerEdit, tablerTrash }),
  templateUrl: './product.component.html',
  host: {
    class: 'p-4 block overflow-hidden',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  statusTemplate = viewChild.required<TemplateRef<TableCellContext<Product>>>('customStatus');
  actionTemplate = viewChild.required<TemplateRef<TableCellContext<Product>>>('customAction');

  tableConfig: TableConfig<Product> = {
    columns: [
      { key: 'name', header: 'Name' },
      {
        key: 'price',
        header: 'Price',
        type: 'currency',
        currencyOptions: { currency: 'VND', locale: 'vi' },
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
    data: products,
  };

  deleteProduct(id: Product['id']): void {
    console.log('Delete product with id:', id);
  }
}
