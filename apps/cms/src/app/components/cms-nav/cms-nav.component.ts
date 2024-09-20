import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  output,
  type OnInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CmsNavComponent implements OnInit {
  routerChange = output<string>();

  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #storage = inject(StorageService);
  #authService = inject(AuthService);

  username = computed(() =>
    this.#authService.isAuthenticated() ? this.#storage.get('username') : '',
  );

  ngOnInit() {
    const routerSubscription = this.#router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ url }) => {
        this.routerChange.emit(url);
      });

    this.#authService.getProfile();
    this.#destroyRef.onDestroy(() => {
      routerSubscription.unsubscribe();
    });
  }

  logout(): void {
    this.#authService.logout();
  }
}
