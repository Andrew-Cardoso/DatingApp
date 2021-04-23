import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { InvalidFeedback } from 'src/app/_models/invalid-feedback';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.sass']
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() tltp = '';
  @Input() feedbacks: InvalidFeedback[] = [];

  constructor(@Self() public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }

}
