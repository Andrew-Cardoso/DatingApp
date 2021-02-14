import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {

  canDeactivate(component: MemberEditComponent): boolean {
    const member = component.member;
    const originalMember = component.originalMember;

    const confirmMsg = 'Are you sure you want to leave? Any unsaved changes will be lost';

    for (const key in member) {
      if (Array.isArray(member[key])) {
        if (member[key].length !== originalMember[key].length) return confirm(confirmMsg);
        for (let i = 0; i < member[key].length; i++) {
          for (const pKey in member[key][i]) {
              if (member[key][i][pKey] !== originalMember[key][i][pKey]) return confirm(confirmMsg);
          }
        }
      } else {
        if (typeof member[key] !== 'string') {
          if (member[key] !== originalMember[key]) return confirm(confirmMsg);
        } else {
          if (member[key].replace(/\s/g,'') !== originalMember[key].replace(/\s/g,'')) {
            return confirm(confirmMsg);
          }
        }
      }
    }
    return true;
  }
  
}
