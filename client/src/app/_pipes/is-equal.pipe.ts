import { Pipe, PipeTransform } from '@angular/core';
import { isEqual } from '../_helpers/isEqual';
import { Member } from '../_models/member';

@Pipe({
  name: 'isEqual',
  pure: false
})
export class IsEqualPipe implements PipeTransform {

  transform(value: Member, value2: Member): boolean {
    return isEqual(value, value2);
  }

}
