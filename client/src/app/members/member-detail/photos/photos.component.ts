import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NgxGalleryAnimation, NgxGalleryImage } from '@kolkov/ngx-gallery';
import { Photo } from 'src/app/_models/photo';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosComponent implements OnInit {

  @Input() photos: Photo[];

  readonly galleryOptions = [
    {
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }
  ];
  
  galleryImages: NgxGalleryImage[];

  ngOnInit () {
    if (this.photos) {
      this.galleryImages = this.photos.sort(a => a.isMain ? -1 : 1).map(photo => {
        return {
          small: photo.url,
          medium: photo.url,
          big: photo.url
        };
      });
    }
  }
  constructor() { }
}
