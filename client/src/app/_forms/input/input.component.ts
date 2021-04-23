import { ChangeDetectionStrategy, Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { InvalidFeedback } from 'src/app/_models/invalid-feedback';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.sass']
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() type = 'text';
  @Input() tltp = '';
  @Input() feedbacks: InvalidFeedback[] = [];
  @Input() showPassword: false;
  
  isShown: boolean;

  constructor(@Self() public ngControl: NgControl) { 
    ngControl.valueAccessor = this;
  }

  toggleInputType() {
    this.type === 'text' ? this.type = 'password' : this.type = 'text';
  }

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }
}
