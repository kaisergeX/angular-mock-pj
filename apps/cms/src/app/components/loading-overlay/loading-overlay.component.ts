import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerLoader2 } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [NgIconComponent],
  providers: provideIcons({ tablerLoader2 }),
  templateUrl: './loading-overlay.component.html',
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOverlayComponent {
  show = input<string | boolean>(false);
}
