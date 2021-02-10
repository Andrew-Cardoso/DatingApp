import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  registerMode: boolean;

  constructor() { }

  ngOnInit() { }

  toggleRegister() {
    this.registerMode = !this.registerMode;
  }
}
