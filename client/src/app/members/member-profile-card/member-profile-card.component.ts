import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Member } from '../../_models/member';

@Component({
  selector: 'app-member-profile-card',
  templateUrl: './member-profile-card.component.html',
  styleUrls: ['./member-profile-card.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberProfileCardComponent implements OnInit {
  @Input() member: Member;

  private year: number;
  private month: number;
  private day: number;
  private hour: number;

  constructor(private changeDect: ChangeDetectorRef) { }

  ngOnInit() {
      const lastActive = new Date(this.member.lastActive);
      this.year = lastActive.getFullYear();
      this.month = lastActive.getMonth();
      this.day = lastActive.getDate();
      this.hour = lastActive.getHours();
  
      this.callUpdate() && this.updateTemplate();
  }

  private async updateTemplate() {
    this.changeDect.detectChanges();
    await new Promise(r => setTimeout(r, 1000));
    this.callUpdate() && this.updateTemplate();
  }

  private callUpdate() {
    const now = new Date();
    const yearNow = now.getFullYear();
    const monthNow = now.getMonth();
    const dayNow = now.getDate();
    const hourNow = now.getHours();
    return this.year === yearNow && this.month === monthNow && this.day === dayNow && hourNow - this.hour < 1;
  }

}
