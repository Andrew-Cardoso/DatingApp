import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit() {
  }

  register() {
    this.accountService.register(this.model).subscribe(() => this.toggle.emit(), error => this.toastr.error(error.error));
  }
  cancel() {
    this.toggle.emit();
  }
}
