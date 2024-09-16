import { ChangeDetectionStrategy, Component, TemplateRef, viewChild } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerEdit, tablerPlus, tablerSearch, tablerTrash } from '@ng-icons/tabler-icons';
import { ProductStatus, type ObjectDetail, type ProductSchema } from '@repo/shared';
import { TableComponent } from '~/components/table/table.component';
import type { TableCellContext, TableConfig } from '~/types';
import { RouterLink } from '@angular/router';

type Product = ObjectDetail<ProductSchema>;

const products: ProductSchema[] = [
  {
    id: 1,
    name: 'Apple MacBook Pro',
    price: 50_000,
    category: 'Laptop',
    status: ProductStatus.ACTIVE,
  },
  {
    id: 2,
    name: 'Apple Watch',
    price: 15_000,
    category: 'Accessories',
    status: ProductStatus.ACTIVE,
  },
  {
    id: 3,
    name: 'Microsoft Surface Pro',
    price: 40_000,
    category: 'Laptop',
    status: ProductStatus.INACTIVE,
  },
  {
    id: 4,
    name: 'iPad',
    price: 20_000,
    category: 'Tablet',
    status: ProductStatus.ACTIVE,
  },
];

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIconComponent, TableComponent, RouterLink],
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

  tableConfig: TableConfig<Product> = {
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
    data: products,
  };

  deleteProduct(id: Product['id']): void {
    console.log('Delete product with id:', id);
  }
}
