import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { Roles } from 'src/app/_enums/roles.enum';
import { clone } from 'src/app/_helpers/clone';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
	selector: 'app-user-management',
	templateUrl: './user-management.component.html',
	styleUrls: ['./user-management.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent implements OnInit {
	private bsModalRef: BsModalRef;

	users$ = new BehaviorSubject<Partial<User[]>>([]);

	constructor(private adminService: AdminService, private modalService: BsModalService, private toastr: ToastrService) {}

	ngOnInit(): void {
		this.getUsersWithRoles();
	}

	async getUsersWithRoles() {
		this.users$.next(await this.adminService.getUsersWithRoles().toPromise());
	}

	openRolesModal(user: User) {
		this.bsModalRef = this.modalService.show(RolesModalComponent, { initialState: { user: clone(user) } });
    this.bsModalRef.content.updateUser.pipe(take(1)).subscribe((user: User) => {
      const users = this.users$.value;
      const i = users.findIndex(({ username }) => username === user.username);
      if (i === -1) return this.toastr.error('Oops, something strange happened');

      this.adminService.updateUserRoles(user).toPromise().then(() => {
        users.splice(i, 1, user);
        this.users$.next(users);
      });
    });
	}
	trackByRoles(index: number, user: Partial<User>): string {
		return (user.roles ?? []).join('-');
	}
}
