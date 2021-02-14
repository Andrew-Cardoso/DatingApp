import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl + 'users/';
  private members: Member[] = [];
  constructor(private http: HttpClient) {}

  getMembers() {
    if (this.members.length > 0) return of(this.members);    
    return this.http.get<Member[]>(this.baseUrl).pipe(map(members => {
      this.members = members;
      return members;
    }));
  }

  getMember(username: string) {
    const member = this.members.find(x => x.username === username);
    if (member) return of(member);
    return this.http.get<Member>(this.baseUrl + username);
  }
  
  updateMember(member: Member) {
    return this.http.put(this.baseUrl, member).pipe(map(() => {
      const i = this.members.findIndex(x => x.id === member.id);
      this.members[i] = member;
    }));
  }
}
