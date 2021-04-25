import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LikePredicate } from '../_enums/like-predicate.enum';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListsComponent implements OnInit {
  readonly LikePredicateEnum = LikePredicate;

  members$ = new BehaviorSubject<Partial<Member[]>>([]);
  predicate = LikePredicate.Liked;
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;

  constructor(private memberSerivce: MembersService) {}

  ngOnInit() {
    this.loadLikes();
  }

  async loadLikes() {
    const { pagination, result } = await this.memberSerivce.getLikes(this.predicate, this.pageNumber, this.pageSize).toPromise();
    this.pagination = pagination;
    this.members$.next(result as Member[]);
  }

  pageChanged(event: unknown) {
    this.pageNumber = event['page'] ?? 1;
    this.loadLikes();
  }
}
