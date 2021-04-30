import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { clone } from 'src/app/_helpers/clone';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { IsEqualPipe } from 'src/app/_pipes/is-equal.pipe';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MemberProfileCardComponent } from '../member-profile-card/member-profile-card.component';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.sass'],
  providers: [IsEqualPipe]
})
export class MemberEditComponent implements OnInit {
  private user: User;
  
  originalMember: Member;
  member: Member;

  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (!this.isEqual.transform(this.member, this.originalMember)) $event.returnValue = true;
  }

  @ViewChild('memberProfileCard') memberProfileCardComponent: MemberProfileCardComponent;

  constructor(
    private accoutService: AccountService,
    private memberService: MembersService,
    private isEqual: IsEqualPipe,
    private toastr: ToastrService
  ) {
    accoutService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit() {
    this.loadMember();
  }

  async loadMember() {
    this.member = await this.memberService.getMember(this.user.username).toPromise();
    this.originalMember = clone(this.member);
  }

  updateMemberUrl(photoUrl: string) {
      this.user.photoUrl = photoUrl;
      this.member.photoUrl = photoUrl;
      this.accoutService.setCurrentUser(this.user);
      this.memberProfileCardComponent.forceUpdate();
  }

  updateMember() {
    if (this.isEqual.transform(this.member, this.originalMember)) {
      this.toastr.info('Não há modificações no seu perfil');
      return;
    }

    this.memberService.updateMember(this.member).pipe(take(1)).subscribe((updatedMember: Member) => {
      this.member = updatedMember;
      this.originalMember = JSON.parse(JSON.stringify(updatedMember));
      this.toastr.success('Profile updated', 'Success');
    }, err => {
      this.toastr.error(err.join(' '), 'Oops!')
    });
  }
}