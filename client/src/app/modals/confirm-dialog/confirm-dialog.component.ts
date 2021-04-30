import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.sass']
})
export class ConfirmDialogComponent implements OnInit {

  title: string;
  message: string;
  btnOkText: string;
  btnCancelText: string;
  result: boolean;

    constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  complete(result?: boolean) {
    this.result = result;
    this.bsModalRef.hide();
  }
}
