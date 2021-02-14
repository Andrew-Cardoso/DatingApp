import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailComponent implements OnInit {

  member$ = this.memberService.getMember(this.route.snapshot.paramMap.get('username'));

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
    private changeDect: ChangeDetectorRef
  ) {}

  ngOnInit() {   
    this.update();
  }

  async update() {
    this.changeDect.detectChanges();
    await new Promise((r) => setTimeout(r, 1000));
    this.update();
  }
}
