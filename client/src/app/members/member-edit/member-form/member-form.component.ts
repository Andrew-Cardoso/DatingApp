import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { WorldService } from 'src/app/_services/world.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberFormComponent {
  @Input() member: Member;
  countries$ = this.worldService.countries$;

  constructor(private worldService: WorldService) { }

  onCountryChanged() {
    this.member.city = "";
  }
}