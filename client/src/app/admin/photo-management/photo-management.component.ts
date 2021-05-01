import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pagination } from 'src/app/_models/pagination';
import { Photo } from 'src/app/_models/photo';
import { AdminService } from 'src/app/_services/admin.service';
import { UsersWithPendingPhotos, UserWithPendingPhotos } from 'src/app/_types/userManagement';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.sass']
})
export class PhotoManagementComponent implements OnInit {

  users$ = new BehaviorSubject<UsersWithPendingPhotos>([]);
  pagination: Pagination;
	pageNumber = 1;
	pageSize = 5;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  async deny(photo: Photo, user: UserWithPendingPhotos) {
    await this.adminService.denyPhoto(photo).toPromise().then(() => {
      const users = this.users$.value;
      const photoIndex = user.photos.indexOf(photo);
      
      user.photos.splice(photoIndex, 1);
      
      if (user.photos.length > 0) return this.users$.next(users);
      
      const userIndex = users.indexOf(user);
      
      users.splice(userIndex, 1);

      this.users$.next(users);
    });
  }

  async accept(photo: Photo, user: UserWithPendingPhotos) {
    await this.adminService
      .acceptPhoto({ userId: user.id, photoId: photo.id })
      .toPromise()
      .then((updatedUser: UserWithPendingPhotos) => {
        const users = this.users$.value;
        const userIndex = users.indexOf(user);
        if (updatedUser?.photos?.length > 0) {
          users.splice(userIndex, 1, updatedUser);
          return this.users$.next(users);
        }

        users.splice(userIndex, 1);
        this.users$.next(users);

    });
  }

  async loadUsers() {
    const { pagination, result } = await this.adminService.getUsersWithPendingPhotos(this.pageNumber, this.pageSize).toPromise();
    this.pagination = pagination;
    this.users$.next(result);
  }

  pageChanged(event: unknown) {
    this.pageNumber = event['page'] ?? 1;
    this.loadUsers();
  }
}
