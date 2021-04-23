import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { InvalidFeedback } from '../_models/invalid-feedback';
import { Photo } from '../_models/photo';
import { AccountService } from '../_services/account.service';
import { PhotosService } from '../_services/photos.service';
import { WorldService } from '../_services/world.service';
import { CustomValidators } from '../_validators/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  @Output() toggle: EventEmitter<void> = new EventEmitter();

  readonly maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
  registerForm: FormGroup;

  step = 0;

  private valueChanges: Subscription;
  private readonly stepsControls: Record<number, string[]> = {
    0: ['knownAs', 'dateOfBirth', 'country', 'city'],
    1: [],
    2: ['photos'],
    3: ['username', 'password', 'confirmPassword'],
  };

  readonly invalidFeedback: Record<string, InvalidFeedback[]> = {
    username: [{ error: 'alreadyTaken', message: 'Username is already taken.' }],
    password: [
      { error: 'minlength', message: 'Password must be at least 4 characters' },
      { error: 'maxlength', message: 'Password must be at most 8 characters' },
    ],
    confirmPassword: [
      {
        error: 'isntMatching',
        message: 'Confirm password must match password',
      },
    ],
  };
  readonly countries$ = this.worldService.countries$;

  constructor(
    private accountService: AccountService,
    private photoService: PhotosService,
    private fb: FormBuilder,
    private changeDect: ChangeDetectorRef,
    private worldService: WorldService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.worldService.setCountries();

    /*
    With the async validator the form status is set to pending, even with changedetection default the status
    just change on input focusout, so if the user just type the name and wait, will wait forever.
\    
    To solve this I just used changeDetection onPush and recursivity to keep detecting changes every 100ms
    
    before the onPush "solution" I tried other 'hacks' like using debounceTime(500), take(1), first()... but none
    seems to solve the pending problem
    */
    this.initDetection();
  }

  register() {
    if (this.registerForm.valid)
      this.accountService.register(this.registerForm.value).subscribe(() => {
        this.router.navigateByUrl('/members');
      });
    this.registerForm.markAllAsTouched();
  }

  cancel() {
    this.toggle.emit();
  }

  validateCurrentStep() {
    const stepControls = this.stepsControls[this.step];
    let invalid: boolean;
    for (const control of stepControls) {
      this.registerForm.get(control).markAsTouched();
      if (this.registerForm.get(control).invalid) invalid = true;
    }
    !invalid && this.next();
  }

  previous() {
    this.step--;
  }
  next() {
    this.step++;
  }

  setMain(index: number) {
    const photos: Photo[] = this.registerForm.get('photos').value;
    if (photos.some((x) => x.isMain)) photos.find((x) => x.isMain).isMain = false;
    photos[index].isMain = !photos[index].isMain;
  }

  deletePhoto(index: number) {
    const control = this.registerForm.get('photos');
    const photos = control.value;
    photos.splice(index, 1);
    control.setValue(photos);
  }

  async onUploadPhoto(event: any) {
    const files = [...event.target.files];
    const photos = await Promise.all(files.map((x) => this.photoService.readAsDataURL(x)));
    const formPhotos = this.registerForm.get('photos');
    formPhotos.setValue([...formPhotos.value, ...photos]);
  }
  private initForm() {
    this.registerForm = this.fb.group({
      knownAs: ['', Validators.required],
      username: ['', [Validators.required], [CustomValidators.usernameExistsAsync(this.accountService)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [this.matchValues('password')]],
      gender: ['f', Validators.required],
      dateOfBirth: [this.maxDate, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      photos: [[], [this.checkPhotosLength()]],
      interests: [''],
      introduction: [''],
      lookingFor: [''],
    });

    this.valueChanges = this.registerForm.controls.password.valueChanges.subscribe(() => this.registerForm.controls.confirmPassword.updateValueAndValidity());
  }

  private matchValues(matchTo: string) {
    return (control: AbstractControl) => (control?.value === control?.parent?.controls[matchTo].value ? null : { isntMatching: true });
  }

  private checkPhotosLength() {
    return (control: AbstractControl) => (control?.value?.length > 0 ? null : { noPhotos: true });
  }

  private async initDetection() {
    await new Promise((r) => setTimeout(r, 100));
    this.changeDect.detectChanges();
    this.initDetection();
  }

  ngOnDestroy() {
    this.valueChanges.unsubscribe();
  }
}
