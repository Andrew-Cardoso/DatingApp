import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Country } from '../_models/country';

@Injectable({
  providedIn: 'root',
})
export class WorldService {

  readonly countries$: BehaviorSubject<Country[]> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {}

  async setCountries() {
    this.countries$.next(await this.http.get<any>('https://countriesnow.space/api/v0.1/countries').pipe(take(1), map(({data}) => data)).toPromise());
  }
}
