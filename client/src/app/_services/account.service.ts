import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RegisterDto } from '../_models/register-dto';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly baseUrl = environment.apiUrl;
  private readonly currentUserSource = new ReplaySubject<User>(1);
  readonly currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http.post(`${this.baseUrl}account/login`, model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(model: RegisterDto) {
    return this.http.post<User>(`${this.baseUrl}account/register`, model).pipe(map((user) => user && this.setCurrentUser(user)));
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  usernameExists(username?: string) {
    if (!username || username.length < 1) return of(false);
    return this.http.get(`${this.baseUrl}account/user-exists/${username}`).pipe(take(1));
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getAuth() {
    return this.http.get(this.baseUrl + 'buggy/auth');
  }
  getBadR() {
    return this.http.get(this.baseUrl + 'buggy/bad-request');
  }
  getInternal() {
    return this.http.get(this.baseUrl + 'buggy/server-error');
  }
  getNF() {
    return this.http.get(this.baseUrl + 'buggy/not-found');
  }
}
