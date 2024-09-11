import { Component, effect, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerDevices,
  tablerCategory2,
  tablerLogout2,
  tablerUserCircle,
} from '@ng-icons/tabler-icons';
import { AuthService, StorageService } from '~/services';

@Component({
  selector: 'app-cms-nav, nav[cmsNav]',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIconComponent],
  providers: provideIcons({ tablerDevices, tablerCategory2, tablerLogout2, tablerUserCircle }),
  templateUrl: './cms-nav.component.html',
  host: {
    class: 'px-2 py-4 flex flex-col gap-2 justify-between',
  },
})
export class CmsNavComponent {
  #storage = inject(StorageService);
  #authService = inject(AuthService);
  username = this.#storage.get('username');

  constructor() {
    effect(() => {
      this.username = this.#authService.isAuthenticated() ? this.#storage.get('username') : '';
    });
  }

  logout(): void {
    this.#authService.logout();
  }
}
