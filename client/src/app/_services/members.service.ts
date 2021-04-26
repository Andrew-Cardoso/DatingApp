import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LikePredicate } from '../_enums/like-predicate.enum';
import { Member } from '../_models/member';
import { Photo } from '../_models/photo';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getFilterHeaders, getPaginatedResult, getPaginationHeaders } from './paginationHelper';
@Injectable({
  providedIn: 'root',
})
export class MembersService {
  readonly baseUrl = environment.apiUrl + 'users/';
  readonly likesUrl = environment.apiUrl + 'likes/';

  user: User;
  private userParams: UserParams;

  constructor(private http: HttpClient, private accountService: AccountService) {
    accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(userParams: UserParams) {
    this.userParams = userParams;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    let params = getPaginationHeaders(userParams);
    params = getFilterHeaders(params, userParams);

    return getPaginatedResult<Member>(this.baseUrl, params, this.http);
  }
  

  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl, member);
  }

  updatePhotos(photos: Photo[]) {
    return this.http.patch(this.baseUrl, photos);
  }

  addLike(username: string) {
    return this.http.post(this.likesUrl + username, {});
  }
  getLikes(predicate: LikePredicate, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders({ pageNumber, pageSize });
    params = params.append('predicate', predicate);

    return getPaginatedResult<Partial<Member>>(this.likesUrl, params, this.http);
  }  
}
