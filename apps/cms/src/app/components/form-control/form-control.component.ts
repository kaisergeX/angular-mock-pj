import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-form-ctrl, [formCtrl]',
  standalone: true,
  imports: [],
  templateUrl: './form-control.component.html',
  host: { class: 'form-ctrl' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlComponent {
  label = input.required<string>();
  definedErrMsg = input('');
  showAsterisk = input<boolean | string>(false);
}
