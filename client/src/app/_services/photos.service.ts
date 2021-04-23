import { Injectable } from '@angular/core';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  constructor() {}
  readAsDataURL(file: any): Promise<Photo> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = function () {
        return resolve({
          url: `${fileReader.result}`,
          isMain: false,
        });
      };
      fileReader.readAsDataURL(file);
    });
  }
}