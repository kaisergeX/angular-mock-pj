import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerApiApp } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [NgIconComponent],
  providers: provideIcons({ tablerApiApp }),
  templateUrl: './auth-layout.component.html',
  host: {
    class: 'flex-center flex-col flex-1 gap-4 bg-pattern p-4',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
