import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Roles } from '../_enums/roles.enum';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent implements OnInit {

  roles = [Roles.Captain, Roles['First Mate']];
  model: any = {};

  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() { }

  login() {
    this.accountService.login(this.model).pipe(take(1)).subscribe(() => this.router.navigateByUrl('/members'));
  }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  internalserver () {
    this.accountService.getInternal().pipe(take(1)).subscribe();
  }
  nf() {
    this.accountService.getNF().pipe(take(1)).subscribe();
  }
  auth() {
    this.accountService.getAuth().pipe(take(1)).subscribe();
  }
  br() {
    this.accountService.getBadR().pipe(take(1)).subscribe();
  }

}
