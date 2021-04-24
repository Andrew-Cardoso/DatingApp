import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Gender } from 'src/app/_enums/gender.enum';
import { Member } from 'src/app/_models/member';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberListComponent implements OnInit {
  
  user: User;
  
  members$ = new BehaviorSubject<Member[]>([]);
  pagination$ = new BehaviorSubject<Pagination>(null);
  userParams$ = new BehaviorSubject<UserParams>(null);

  readonly genderList = [{ value: Gender.Male, title: 'Males' }, { value: Gender.Female, title: 'Females' }];

  constructor(private membersService: MembersService) {
    this.userParams$.next(membersService.getUserParams());
  }

  ngOnInit() {
    this.loadMembers();
  }

  trackById(index: number, member: Member): number {
    return member.id;
  }

  async loadMembers() {
    this.membersService.setUserParams(this.userParams$.value);
    const {pagination, result} = await this.membersService.getMembers(this.userParams$.value).toPromise();
    this.pagination$.next(pagination);
    this.members$.next(result);
  }

  resetFilters() {
    this.userParams$.next(this.membersService.resetUserParams());
    this.loadMembers();
  }

  pageChanged(event: unknown) {
    this.userParams$.value.pageNumber = event['page'] ?? 1;
    this.membersService.setUserParams(this.userParams$.value);
    this.loadMembers();
  }
}
