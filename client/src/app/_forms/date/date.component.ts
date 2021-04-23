import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { InvalidFeedback } from 'src/app/_models/invalid-feedback';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.sass'],
})
export class DateComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() maxDate: Date;
  @Input() feedbacks: InvalidFeedback[] = [];
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
    this.bsConfig = {
      containerClass: 'theme-default',
      isAnimated: true,
      dateInputFormat: 'DD MMMM YYYY',
      adaptivePosition: true,
    };
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
}
