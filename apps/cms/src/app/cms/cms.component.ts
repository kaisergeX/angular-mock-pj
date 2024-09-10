import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CmsNavComponent, HeaderComponent } from '../components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [RouterOutlet, CmsNavComponent, HeaderComponent, CommonModule],
  templateUrl: './cms.component.html',
  host: {
    class: 'flex flex-1 overflow-y-auto h-full',
  },
})
export class CmsComponent {}
