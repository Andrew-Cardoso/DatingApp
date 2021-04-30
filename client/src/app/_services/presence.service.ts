import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class PresenceService {
	private readonly url = environment.hubUrl;
	private hubConnection: HubConnection;

	private readonly onlineUsersSource$ = new BehaviorSubject<string[]>([]);
	onlineUsers$ = this.onlineUsersSource$.asObservable();

	constructor(private toastr: ToastrService, private router: Router) {}

	createHubConnection(user: User) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(`${this.url}presence`, { accessTokenFactory: () => user.token })
			.withAutomaticReconnect()
			.build();

		this.hubConnection.start().catch((error) => console.log(error));

		this.hubConnection.on('UserIsOnline', (username) => {
			const onlineUsers = [...this.onlineUsersSource$.value, username];
			this.onlineUsersSource$.next(onlineUsers);
			// this.toastr.info(`${username} has connected`);
		});

		this.hubConnection.on('UserIsOffline', (username) => {
			const onlineUsers = this.onlineUsersSource$.value.filter(x => x !== username);
			this.onlineUsersSource$.next(onlineUsers);
			// this.toastr.warning(`${username} has disconnected`);
		});

		this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => this.onlineUsersSource$.next(usernames));

		this.hubConnection.on('NewMessageReceived', ({ username, knownAs, messagePreview }) =>
			this.toastr
				.info(messagePreview, knownAs, { progressBar: true })
				.onTap.pipe(take(1))
				.subscribe(() => this.router.navigateByUrl(`/members/${username}?tab=3`))
		);
	}

	stopHubConnection() {
		this.hubConnection.stop().catch((error) => console.log(error));
	}
}
