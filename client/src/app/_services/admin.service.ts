import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Photo } from '../_models/photo';
import { User } from '../_models/user';
import { UserPhotoApproval, UserWithPendingPhotos } from '../_types/userManagement';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private url = `${environment.apiUrl}admin/`;

  constructor(private http: HttpClient) { }

  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(`${this.url}users-with-roles`);
  }

  updateUserRoles(user: User) {
    return this.http.post(`${this.url}edit-roles/${user.username}?roles=${user.roles.join(',')}`, {});
  }

  getUsersWithPendingPhotos(pageNumber: number, pageSize: number) {
    const params = getPaginationHeaders({pageNumber, pageSize});
    return getPaginatedResult<UserWithPendingPhotos>(`${this.url}users-photos-to-moderate`, params, this.http);
  }

  denyPhoto(photo: Photo) {
    return this.http.delete(this.url + photo.id);
  }

  acceptPhoto(userPhotoApproval: UserPhotoApproval) {
    return this.http.patch<UserWithPendingPhotos>(this.url, userPhotoApproval);
  }
}
