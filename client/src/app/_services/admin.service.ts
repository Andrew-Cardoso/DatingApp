import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(`${this.url}admin/users-with-roles`);
  }

  updateUserRoles(user: User) {
    return this.http.post(`${this.url}admin/edit-roles/${user.username}?roles=${user.roles.join(',')}`, {});
  }
}
