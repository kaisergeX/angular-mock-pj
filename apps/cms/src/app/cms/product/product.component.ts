import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  TemplateRef,
  viewChild,
  type AfterViewInit,
  type OnDestroy,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerEdit,
  tablerListDetails,
  tablerLoader2,
  tablerPlus,
  tablerSearch,
  tablerTrash,
} from '@ng-icons/tabler-icons';
import { type ObjectDetail, type ProductSchema } from '@repo/shared';
import { TableComponent } from '~/components/table/table.component';
import type { TableCellContext, TableConfig } from '~/types';
import { RouterLink } from '@angular/router';
import { ProductService } from './product.service';
import { LoadingOverlayComponent } from '~/components';
import { debounceTime, fromEvent } from 'rxjs';

type Product = ObjectDetail<ProductSchema>;
const loadingTracker = new Set<Product['id']>();

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIconComponent, TableComponent, RouterLink, LoadingOverlayComponent],
  providers: provideIcons({
    tablerSearch,
    tablerEdit,
    tablerTrash,
    tablerPlus,
    tablerListDetails,
    tablerLoader2,
  }),
  templateUrl: './product.component.html',
  host: {
    class: 'sm:p-4 flex-1 overflow-hidden',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent implements AfterViewInit, OnDestroy {
  statusTemplate = viewChild.required<TemplateRef<TableCellContext<Product>>>('customStatus');
  actionTemplate = viewChild.required<TemplateRef<TableCellContext<Product>>>('customAction');
  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('productSearch');
  #productService = inject(ProductService);

  productsQuery = this.#productService.productsQuery();
  filterdProducts = signal<ProductSchema[] | undefined>(undefined);
  tableData = computed(() => this.filterdProducts() || this.productsQuery.data());

  isLoadingDeletions = signal(loadingTracker);

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
    data: this.tableData,
  };

  ngAfterViewInit() {
    fromEvent(this.searchInput().nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe((event) => {
        const searchValue = (event.target as HTMLInputElement)?.value || '';
        const filtered = this.productsQuery
          .data()
          ?.filter((product) => product.name.toLowerCase().includes(searchValue.toLowerCase()));
        this.filterdProducts.set(filtered);
      });
  }

  #untrackDeleteId(id: Product['id']) {
    if (!loadingTracker.has(id)) {
      return;
    }

    loadingTracker.delete(id);
    this.isLoadingDeletions.set(new Set(loadingTracker));
  }

  deleteProduct(id: Product['id']): void {
    loadingTracker.add(id);
    this.isLoadingDeletions.set(new Set(loadingTracker));

    this.#productService.deleteProduct(id, {
      onSuccess: () => {
        this.#untrackDeleteId(id);
        this.productsQuery.refetch();
      },
      onError: () => this.#untrackDeleteId(id),
    });
  }

  ngOnDestroy(): void {
    loadingTracker.clear();
  }
}
