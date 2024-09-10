import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerDevices, tablerCategory2 } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-cms-nav, nav[cmsNav]',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIconComponent],
  providers: provideIcons({ tablerDevices, tablerCategory2 }),
  templateUrl: './cms-nav.component.html',
  host: {
    class:
      'p-2 [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:py-2 [&>.link]:text-md [&_ng-icon]:text-xl',
  },
})
export class CmsNavComponent {}
