import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
	providedIn: 'root',
})
export class MessageService {
	private readonly baseUrl = `${environment.apiUrl}messages/`;

	constructor(private http: HttpClient) {}

	getMessages(pageNumber: number, pageSize: number, container: string) {
		let params = getPaginationHeaders({ pageNumber, pageSize });
		params = params.append('Container', container);
		return getPaginatedResult<Message>(this.baseUrl, params, this.http);
	}

	getMessageThread(username: string) {
		return this.http.get<Message[]>(`${this.baseUrl}thread/${username}`);
	}

	sendMessage(receiverUsername: string, content: string) {
		return this.http.post<Message>(this.baseUrl, {receiverUsername, content});
	}

	deleteMessage(id: number) {
		return this.http.delete(this.baseUrl + id);
	}
}
