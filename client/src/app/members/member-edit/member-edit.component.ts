import { Component, HostListener, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { IsEqualPipe } from 'src/app/_pipes/is-equal.pipe';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

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
    this.originalMember = JSON.parse(JSON.stringify(this.member));
  }

  updateMember() {
    if (this.isEqual.transform(this.member, this.originalMember)) {
      this.toastr.info('Não há modificações no seu perfil');
      return;
    }

    this.memberService.updateMember(this.member).pipe(take(1)).subscribe(() => {
      this.originalMember = JSON.parse(JSON.stringify(this.member));
      this.toastr.success('Profile updated', 'Success');
    }, err => {
      this.toastr.error(err.join(' '), 'Oops!')
    });
  }
}