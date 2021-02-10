import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {

  @Output() toggle: EventEmitter<void> = new EventEmitter();

  model: any = {};

  constructor(private accountService: AccountService) { }

  ngOnInit() {
  }

  register() {
    this.accountService.register(this.model).subscribe(() => this.toggle.emit());
  }
  cancel() {
    this.toggle.emit();
  }
}
