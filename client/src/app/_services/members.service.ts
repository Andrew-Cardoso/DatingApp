import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LikePredicate } from '../_enums/like-predicate.enum';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { Photo } from '../_models/photo';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
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
    let params = this.getPaginationHeaders(userParams);
    params = this.getFilterHeaders(params, userParams);

    return this.getPaginatedResult<Member>(this.baseUrl, params);
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
    let params = this.getPaginationHeaders({ pageNumber, pageSize });
    params = params.append('predicate', predicate);

    return this.getPaginatedResult<Partial<Member>>(this.likesUrl, params);
  }

  private getPaginationHeaders({ pageNumber, pageSize }: Partial<UserParams>) {
    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', `${pageNumber}`);
      params = params.append('pageSize', `${pageSize}`);
    }

    return params;
  }
  private getFilterHeaders(params: HttpParams, { minAge, maxAge, gender, orderBy }: UserParams) {
    if (minAge) params = params.append('minAge', `${minAge}`);
    if (maxAge) params = params.append('maxAge', `${maxAge}`);
    if (gender) params = params.append('gender', gender);
    if (orderBy) params = params.append('orderBy', orderBy);
    return params;
  }

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult = new PaginatedResult<T>();
    return this.http
      .get<T[]>(url, { observe: 'response', params })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          const pagination = response.headers.get('Pagination');
          if (pagination) paginatedResult.pagination = JSON.parse(pagination);
          return paginatedResult;
        })
      );
  }
}
