import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-messages-tab',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.sass']
})
export class MessagesTabComponent {
  @Input() messages: any;
  constructor() { }

}
