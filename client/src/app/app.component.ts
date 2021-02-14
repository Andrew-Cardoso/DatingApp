import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { WorldService } from './_services/world.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'client';
  users: any[];

  constructor(private accountService: AccountService, private worldService: WorldService) {}

  ngOnInit() {
    this.setCurrentUser();
    this.setCountries();
  }

  private setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }

  private setCountries() {
    this.worldService.setCountries();
  }
}
