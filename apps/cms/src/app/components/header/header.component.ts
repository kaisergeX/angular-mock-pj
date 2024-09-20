import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  showHeader = signal(false);
  activePageTitle = signal<string | undefined>(undefined);

  ngOnInit() {
    this.updateHeader();
    const routerSubscription = this.#router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateHeader());

    this.#destroyRef.onDestroy(() => routerSubscription.unsubscribe());
  }

  updateHeader() {
    const activatedRouteSnapshot =
      this.#activatedRoute.firstChild?.snapshot || this.#activatedRoute.snapshot;
    if (!activatedRouteSnapshot) {
      this.showHeader.set(false);
      return;
    }

    const title = activatedRouteSnapshot.title;
    this.showHeader.set(activatedRouteSnapshot.data['showHeader'] === true && !!title);
    this.activePageTitle.set(title);
  }
}
