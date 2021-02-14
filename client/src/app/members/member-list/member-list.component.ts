import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberListComponent {
  
  members$ = this.membersService.getMembers();

  constructor(private membersService: MembersService) { }

  trackById(index: number, member: Member): number {
    return member.id;
  }
}
