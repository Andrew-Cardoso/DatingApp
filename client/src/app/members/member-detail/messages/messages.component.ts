import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-messages-tab',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesTabComponent implements OnInit {
  @ViewChild('chatBody') chatBody: any;
  @ViewChild('messageForm') messageForm: NgForm;
  @Input() username: string;
  readonly messages$ = new BehaviorSubject<Message[]>([]);

  messageContent: string;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  async loadMessages() {    
    this.messages$.next(await this.messageService.getMessageThread(this.username).toPromise());
    this.scrollToEnd();
  }

  async sendMessage() {
    const message = await this.messageService.sendMessage(this.username, this.messageContent).toPromise();
    const messages = this.messages$.value;
    messages.push(message);
    this.messageForm.reset();
    this.messages$.next(messages);
    this.scrollToEnd();
  }

  private scrollToEnd() {
    setTimeout(() => this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight);
  }
}
