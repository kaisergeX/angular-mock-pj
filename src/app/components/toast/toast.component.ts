import {
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
  type AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
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
      if (toggleEvent.newState === 'open') {
        setTimeout(() => {
          this.toastRef().nativeElement.hidePopover();
          this.#toastService.hide();
        }, this.toastData().autoClose || 0);
      }
    });
  }
}
