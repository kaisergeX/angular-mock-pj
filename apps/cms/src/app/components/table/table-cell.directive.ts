import {
  Directive,
  EmbeddedViewRef,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
  type OnChanges,
  type SimpleChanges,
} from '@angular/core';
import type { ObjectAny, TableCellContext } from '~/types';

@Directive({
  selector: '[appTableCellRender]',
  standalone: true,
})
export class TableCellDirective<TData extends ObjectAny = ObjectAny> implements OnChanges {
  template = input.required<TemplateRef<TableCellContext<TData>>>({ alias: 'appTableCellRender' });
  context = input.required<TableCellContext<TData>>({ alias: 'appTableCellRenderContext' });

  ref: EmbeddedViewRef<unknown> | null = null;
  readonly #viewContainerRef = inject(ViewContainerRef);

  ngOnChanges(changes: SimpleChanges) {
    // if (this.ref instanceof ComponentRef) {
    //   this.ref.injector.get(ChangeDetectorRef).markForCheck();
    // }
    if (!changes['template']) {
      return;
    }

    this.render();
  }

  render() {
    this.#viewContainerRef.clear();
    const templateVal = this.template();
    if (templateVal === null || templateVal === undefined) {
      this.ref = null;
      return;
    }

    return this.#viewContainerRef.createEmbeddedView(templateVal, this.#getTemplateRefContext());
  }

  #getTemplateRefContext(): TableCellContext<TData> {
    const getContext = () => this.context();
    return {
      get $implicit() {
        return getContext().$implicit;
      },
    };
  }

  // https://angular.dev/guide/directives/structural-directives#typing-the-directives-context
  static ngTemplateContextGuard<T extends ObjectAny>(
    _: TableCellDirective<T>,
    ctx: unknown,
  ): ctx is TableCellContext<T> {
    // As before the guard body is not used at runtime, and included only to avoid
    // TypeScript errors.
    return true;
  }
}
