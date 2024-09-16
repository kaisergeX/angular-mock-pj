import {
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
  type AfterViewInit,
} from '@angular/core';
import { ToastService } from '../../toast.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerCircleCheck, tablerExclamationCircle, tablerX } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgIconComponent],
  providers: provideIcons({ tablerExclamationCircle, tablerCircleCheck, tablerX }),
  templateUrl: './toast.component.html',
})
export class ToastComponent implements AfterViewInit {
  toastRef = viewChild.required<ElementRef<HTMLDivElement>>('globalToast');
  #toastService = inject(ToastService);
  toastData = this.#toastService.config;

  constructor() {
    effect(() => {
      if (this.toastData().show) {
        this.toastRef().nativeElement.showPopover();
      }
    });
  }

  ngAfterViewInit() {
    this.toastRef().nativeElement.addEventListener('toggle', (event) => {
      const toggleEvent = event as ToggleEvent;
      const autoClose = this.toastData().autoClose;
      if (toggleEvent.newState === 'open' && autoClose) {
        setTimeout(() => {
          this.toastRef().nativeElement.hidePopover();
          this.#toastService.hide();
        }, autoClose);
      }
    });
  }
}
