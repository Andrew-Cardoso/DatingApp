import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Photo } from 'src/app/_models/photo';
import { PhotosService } from 'src/app/_services/photos.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() setMainUrl = new EventEmitter<string>();
  constructor(private photoService: PhotosService, private changeDect: ChangeDetectorRef, private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  async onUploadPhoto(event: any) {
    const files = [...event.target.files];
    const photos = (await Promise.all(files.map(x => this.photoService.readAsDataURL(x)))) as Photo[];
    this.photos.push(...photos);
    this.changeDect.detectChanges();
  }

  setMain(photo: Photo) {
    this.photos.find(x => x.isMain).isMain = false;
    photo.isMain = true;

    if (photo.isApproved) {
      this.setMainUrl.emit(photo.url);
      return;
    }

    this.toastr.info('This photo will be set as main once it is approved', 'Requires approval');
    this.setMainUrl.emit('assets/photos/default.png');
  }
  deletePhoto(photo: Photo) {    
    if (this.photos.length === 1) return this.toastr.warning('You must have at least one photo');
    this.photos.splice(this.photos.indexOf(photo), 1);
    if (!this.photos.some(x => x.isMain)) {
      this.photos[0].isMain = true;
      this.setMainUrl.emit(this.photos[0].url);
    }
  }
}
