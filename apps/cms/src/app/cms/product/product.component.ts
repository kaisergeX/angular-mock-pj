import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { safeAnyToNumber, type ObjectDetail, type ProductSchema } from '@repo/shared';
import { TableComponent } from '~/components/table/table.component';
import type { TableCellContext, TableConfig } from '~/types';
import { RouterLink } from '@angular/router';
import { ProductService } from './product.service';
import { LoadingOverlayComponent } from '~/components';
import { CategoryService } from '../category/category.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

type Product = ObjectDetail<ProductSchema>;
const loadingTracker = new Set<Product['id']>();

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    NgIconComponent,
    TableComponent,
    RouterLink,
    LoadingOverlayComponent,
    ReactiveFormsModule,
  ],
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
  #productService = inject(ProductService);
  #categoryService = inject(CategoryService);
  #fb = inject(FormBuilder);

  categoriesQuery = this.#categoryService.categoriesQuery();
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
      { key: 'categoryName', header: 'Category' },
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

  filterForm = this.#fb.group({
    name: this.#fb.control('', { nonNullable: true }),
    categoryId: this.#fb.control('', { nonNullable: true }),
  });

  ngAfterViewInit() {
    this.filterForm.valueChanges.pipe(debounceTime(400)).subscribe((value) => {
      const filtered = this.productsQuery.data()?.filter((product) => {
        let isNameMatch = true;
        let isCategoryMatch = true;
        if (value.name) {
          isNameMatch = product.name.toLowerCase().includes(value.name.toLowerCase());
        }

        if (value.categoryId) {
          isCategoryMatch = product.categoryId === safeAnyToNumber(value.categoryId).result;
        }

        return isNameMatch && isCategoryMatch;
      });

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
