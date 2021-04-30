import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { isEqual } from '../_helpers/isEqual';
import { ConfirmService } from '../_services/confirm.service';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {

  constructor(private confirmService: ConfirmService) {}

  canDeactivate(component: MemberEditComponent): Observable<boolean> | boolean  {
    const member = component.member;
    const originalMember = component.originalMember;
    if (isEqual(member, originalMember)) return true;

    return this.confirmService.confirm(undefined, 'Are you sure you want to leave? Any unsaved changes will be lost');
  }
  
}
