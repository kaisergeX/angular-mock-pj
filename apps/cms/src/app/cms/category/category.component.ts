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
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerEdit,
  tablerPlus,
  tablerListDetails,
  tablerLoader2,
  tablerSearch,
} from '@ng-icons/tabler-icons';
import { LoadingOverlayComponent } from '~/components';
import { TableComponent } from '~/components/table/table.component';
import { CategoryService } from './category.service';
import type { TableCellContext, TableConfig } from '~/types';
import type { CategorySchema, ObjectDetail } from '@repo/shared';
import { debounceTime, fromEvent } from 'rxjs';

type Category = ObjectDetail<CategorySchema>;

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [NgIconComponent, TableComponent, RouterLink, LoadingOverlayComponent],
  providers: provideIcons({
    tablerSearch,
    tablerEdit,
    tablerPlus,
    tablerListDetails,
    tablerLoader2,
  }),
  templateUrl: './category.component.html',
  host: {
    class: 'sm:p-4 flex-1 overflow-hidden',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent implements AfterViewInit {
  actionTemplate = viewChild.required<TemplateRef<TableCellContext<Category>>>('customAction');
  searchInput = viewChild.required<ElementRef<HTMLInputElement>>('categorySearch');
  #categoryService = inject(CategoryService);

  categoriesQuery = this.#categoryService.categoriesQuery();
  filterdCategories = signal<CategorySchema[] | undefined>(undefined);
  tableData = computed(() => this.filterdCategories() || this.categoriesQuery.data());

  tableConfig: TableConfig<Category> = {
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'description', header: 'Description' },
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
      .pipe(debounceTime(400))
      .subscribe((event) => {
        const searchValue = (event.target as HTMLInputElement)?.value || '';
        const filtered = this.categoriesQuery
          .data()
          ?.filter((cate) => cate.name.toLowerCase().includes(searchValue.toLowerCase()));
        this.filterdCategories.set(filtered);
      });
  }
}
