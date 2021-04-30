import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
	selector: 'app-member-detail',
	templateUrl: './member-detail.component.html',
	styleUrls: ['./member-detail.component.sass'],
})
export class MemberDetailComponent implements OnInit {
	@ViewChild('tabs', { static: true }) tabs: TabsetComponent;

	member: Member;
	onMessages = false;

	constructor(private route: ActivatedRoute, router: Router) {
		router.routeReuseStrategy.shouldReuseRoute = () => false;
	}

	ngOnInit() {
		this.route.data.pipe(take(1)).subscribe(({ member }) => (this.member = member));
		this.route.queryParams.pipe(take(1)).subscribe(({ tab }) => this.selectTab(tab ?? 0));
	}

	selectTab(tabId: number) {
		this.tabs.tabs[tabId].active = true;
	}
}
