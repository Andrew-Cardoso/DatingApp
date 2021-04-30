import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberCardComponent {
  @Input() member: Member;
  constructor(private memberService: MembersService, private toastr: ToastrService, public presence: PresenceService) {}

  async addLike(member: Member) {
    await this.memberService
      .addLike(member.username)
      .toPromise()
      .then(() => this.toastr.success(`You have liked ${member.knownAs}`));
  }
}
