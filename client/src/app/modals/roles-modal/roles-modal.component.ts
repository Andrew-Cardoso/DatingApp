import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Roles } from 'src/app/_enums/roles.enum';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.sass']
})
export class RolesModalComponent implements OnInit {
  @Input() updateUser = new EventEmitter<User>();
  user: User;

  readonly roles: Readonly<string[]> = Object.values(Roles);

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  toggleRole(role: Roles) {
    console.log(role);
    const roles = this.user.roles;
    const i = roles.findIndex(x => x === role);
    i === -1 ? roles.push(role) : roles.splice(i, 1);
  }

  updateRoles() {
    this.updateUser.emit(this.user);
    this.bsModalRef.hide();
  }

}
