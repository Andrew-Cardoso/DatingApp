import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InterestsComponent {
  @Input() interests: string;
  constructor() { }
}
