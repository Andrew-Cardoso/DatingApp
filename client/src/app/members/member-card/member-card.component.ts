import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Member } from 'src/app/_models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberCardComponent {
  @Input() member: Member;
  constructor() { }
}
