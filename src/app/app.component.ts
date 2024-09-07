import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components';
import { ToastComponent } from "./components/toast/toast.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule, ToastComponent],
  templateUrl: './app.component.html',
  // host: {
  //   '[class.overflow-hidden]': 'true',
  // },
})
export class AppComponent {
  // @HostBinding('class.overflow-hidden') overflowHiddenClass = true;
  // @HostBinding('class') overflowHiddenClass = 'overflow-hidden';
}
