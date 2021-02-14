import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  @Input() lookingFor: string;
  @Input() introduction: string;

  constructor() { }
}
