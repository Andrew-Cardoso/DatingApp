import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'hasError',
  pure: false
})
export class HasErrorPipe implements PipeTransform {

  transform(form: FormGroup, key: string): boolean {
    const property = form.get(key);
    return property.touched && property.invalid;
  }

}
