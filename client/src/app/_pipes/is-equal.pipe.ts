import { Pipe, PipeTransform } from '@angular/core';
import { Member } from '../_models/member';

@Pipe({
  name: 'isEqual',
  pure: false
})
export class IsEqualPipe implements PipeTransform {

  transform(value: Member, value2: Member): boolean {
    for (const key in value) {
      if (Array.isArray(value[key])) {
        if (value[key].length !== value2[key].length) return false;
        for (let i = 0; i < value[key].length; i++) {
          for (const pKey in value[key][i]) {
              if (value[key][i][pKey] !== value2[key][i][pKey]) return false;
          }
        }
      } else {
        if (typeof value[key] !== 'string') {
          if (value[key] !== value2[key]) return false;
        } else {
          if (value[key].replace(/\s/g,'') !== value2[key].replace(/\s/g,'')) {
            return false;
          }
        }
        //return false;
      }
    }
    return true;
  }

}
