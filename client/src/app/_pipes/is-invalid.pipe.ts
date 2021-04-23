import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'isInvalid',
  pure: false
})
export class IsInvalidPipe implements PipeTransform {

  transform(form: FormGroup, property: string): boolean {
    return form.get(property).errors && form.get(property).touched;
  }

}
