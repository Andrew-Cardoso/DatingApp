import { Pipe, PipeTransform } from '@angular/core';
import { Country } from '../_models/country';

@Pipe({
  name: 'cities'
})
export class CitiesPipe implements PipeTransform {

  transform(countries: Country[], countryName: string): string[] {
    return countries.find((x) => x.country === countryName)?.cities;
  }

}
