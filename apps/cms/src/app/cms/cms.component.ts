import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CmsNavComponent, HeaderComponent } from '../components';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerLayoutSidebarLeftCollapse, tablerMenu2 } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    CmsNavComponent,
    HeaderComponent,
    CommonModule,
    NgIconComponent,
  ],
  providers: provideIcons({ tablerMenu2, tablerLayoutSidebarLeftCollapse }),
  templateUrl: './cms.component.html',
  host: {
    class: 'flex flex-1 overflow-y-auto h-full',
  },
})
export class CmsComponent {
  openNav = false;
}
