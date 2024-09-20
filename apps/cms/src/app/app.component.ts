import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ToastComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // host: {
  //   '[class.overflow-hidden]': 'true',
  // },
})
export class AppComponent {
  // @HostBinding('class.overflow-hidden') overflowHiddenClass = true;
  // @HostBinding('class') overflowHiddenClass = 'overflow-hidden';
}
