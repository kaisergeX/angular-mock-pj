import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ObjectAny } from '@repo/shared';
import type { TableCellContext, TableConfig } from '~/types';
import { TableCellDirective } from './table-cell.directive';
import { CustomCurrencyPipe } from '~/pipes';

@Component({
  selector: 'app-table, table[appTable]',
  standalone: true,
  imports: [TableCellDirective, CommonModule, CustomCurrencyPipe],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<TData extends ObjectAny = ObjectAny> {
  defaultCell = viewChild.required<TemplateRef<TData>>('defaultCell');
  config = input.required<TableConfig<TData>>();

  rows = computed(() => {
    const { columns, data: dataList } = this.config();
    return dataList.map((record) =>
      columns.map((column) => ({
        ...column,
        className: column.className || '',
        value: record[column.key],
        getContext: () =>
          ({
            $implicit: {
              record,
              key: column.key,
              value: column.key in record ? record[column.key] : undefined,
            },
          }) satisfies TableCellContext<TData>,
      })),
    );
  });
}
