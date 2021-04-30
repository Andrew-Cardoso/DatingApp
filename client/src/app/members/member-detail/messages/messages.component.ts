import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { StringHasValuePipe } from 'src/app/_pipes/string-has-value.pipe';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
	selector: 'app-messages-tab',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [StringHasValuePipe],
})
export class MessagesTabComponent implements OnInit, OnDestroy {

	// Beware, you entered the 'only works with timeouts everywhere and I dont know why' zone


	@ViewChild('chatBody') chatBody: any;
	@ViewChild('messageForm') messageForm: NgForm;
	@Input() username: string;

	private user: User;

	readonly messages$ = this.messageService.messageThread$;

	messageContent: string;

	constructor(private messageService: MessageService, private stringHasValuePipe: StringHasValuePipe, accountService: AccountService) {
		accountService.currentUser$.pipe(take(1)).subscribe((user) => (this.user = user));
	}

	ngOnInit(): void {
		// user is the current user. Username comes from the member the user clicked.
		this.messageService.createHubConnection(this.user, this.username, () => setTimeout(() => this.scrollToEnd()));
	}

	async loadMessages() {
		// this.messages$.next(await this.messageService.getMessageThread(this.username).toPromise());
		this.scrollToEnd();
	}

	async sendMessage() {
		if (!this.stringHasValuePipe.transform(this.messageContent)) return;

		await this.messageService.sendMessage(this.username, this.messageContent.trim());
		this.messageForm.reset();
		setTimeout(() => this.scrollToEnd());
	}

	private scrollToEnd() {
		setTimeout(() => (this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight));
	}

	ngOnDestroy(): void {
		this.messageService.stopHubConnection();
	}
}
