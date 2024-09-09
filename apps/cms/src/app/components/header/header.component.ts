import { Component, inject, type OnInit } from '@angular/core';
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
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  showHeader = false;
  activePageTitle?: string;

  ngOnInit() {
    this.#router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const activatedRouteSnapshot = this.#activatedRoute.firstChild?.snapshot;
      if (!activatedRouteSnapshot) {
        return;
      }

      const title = activatedRouteSnapshot.title;
      this.showHeader = activatedRouteSnapshot.data['hideHeader'] ? false : !!title;
      this.activePageTitle = title;
    });
  }
}
