import { Component, DestroyRef, inject, type OnInit } from '@angular/core';
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
})
export class HeaderComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  showHeader = false;
  activePageTitle?: string;

  ngOnInit() {
    this.updateHeader();
    const routerSubscription = this.#router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateHeader();
      });

    this.#destroyRef.onDestroy(() => {
      routerSubscription.unsubscribe();
    });
  }

  updateHeader() {
    const activatedRouteSnapshot =
      this.#activatedRoute.firstChild?.snapshot || this.#activatedRoute.snapshot;
    if (!activatedRouteSnapshot) {
      this.showHeader = false;
      return;
    }

    const title = activatedRouteSnapshot.title;
    this.showHeader = activatedRouteSnapshot.data['hideHeader'] ? false : !!title;
    this.activePageTitle = title;
  }
}
