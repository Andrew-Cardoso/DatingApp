import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {
  private readonly genders = {
    f: 'Female',
    m: 'Male'
  }
  transform(value: string): string {
    if(!value) return 'Not sure';
    return this.genders[value];
  }

}
