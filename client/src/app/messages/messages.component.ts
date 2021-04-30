import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageContainer } from '../_enums/message-container.enum';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { ConfirmService } from '../_services/confirm.service';
import { MessageService } from '../_services/message.service';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit {
	readonly messages$ = new BehaviorSubject<Message[]>(null);
	readonly loading$ = new BehaviorSubject(false);

	readonly ContainerEnum = MessageContainer;

	container = this.ContainerEnum.Unread;

	pagination: Pagination;
	pageNumber = 1;
	pageSize = 5;

	constructor(private messageService: MessageService, private confirmService: ConfirmService) {}

	ngOnInit() {
		this.loadMessages();
	}

	async loadMessages() {
		this.loading$.next(true);
		const { pagination, result } = await this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).toPromise();
		this.pagination = pagination;
		this.messages$.next(result);
		setTimeout(() => this.loading$.next(false));
	}

	async deleteMessage(id: number) {
		const confirmed = await this.confirmService.confirm('Delete message', 'This cannot be undone').toPromise();

		if (!confirmed) return;

		const messages = this.messages$.value;
		const index = messages.findIndex((x) => x.id === id);
		this.messageService
			.deleteMessage(id)
			.toPromise()
			.then(() => {
				messages.splice(index, 1);
				this.messages$.next(messages);
			});
	}

	pageChanged(event: unknown) {
		this.pageNumber = event['page'] ?? 1;
		this.loadMessages();
	}
}
