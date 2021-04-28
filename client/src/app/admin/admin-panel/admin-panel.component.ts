import { Component, OnInit } from '@angular/core';
import { Roles } from 'src/app/_enums/roles.enum';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.sass']
})
export class AdminPanelComponent implements OnInit {
  captainRole = [Roles.Captain];

  constructor() { }

  ngOnInit(): void {
  }

}
