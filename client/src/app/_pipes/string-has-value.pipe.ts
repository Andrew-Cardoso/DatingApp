import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringHasValue'
})
export class StringHasValuePipe implements PipeTransform {

  transform(value?: string): boolean {
    if ((value ?? '').replace(/\s/g, '') === '') return false;
    return true;
  }

}
