import { Pipe, PipeTransform } from '@angular/core';
import { Roles } from '../_enums/roles.enum';

@Pipe({
  name: 'formatRoles'
})
export class FormatRolesPipe implements PipeTransform {

  transform(roles: Roles[] = []): string {
    return roles.join(', ').split(/(?=[A-Z])/).join(' ');
  }

}
