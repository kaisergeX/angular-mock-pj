import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import type { PreviewImageData } from './preview-image.model';

@Component({
  selector: 'app-preview-image, dialog[previewImage]',
  standalone: true,
  imports: [],
  templateUrl: './preview-image.component.html',
  host: {
    class: 'dialog relative backdrop:bg-slate-800/80',
    '(reference)': 'previewDialog',
    '(mousedown)': 'onMouseDown($event)',
  },
})
export class PreviewImageComponent {
  #hostPreviewDialogRef = inject<ElementRef<HTMLDialogElement>>(ElementRef); // access the Host <dialog> element
  previewDialog = this.#hostPreviewDialogRef.nativeElement;

  onClose = output();
  data = input<PreviewImageData>();

  constructor() {
    effect(() => {
      if (!this.data()) {
        this.previewDialog.close();
        return;
      }

      this.previewDialog.showModal();
    });
  }

  onMouseDown(e: MouseEvent) {
    if (!(e.target instanceof HTMLDialogElement)) {
      return;
    }

    if (e.target.nodeName === 'DIALOG') {
      this.previewDialog.close('dismiss');
    }
  }
}
