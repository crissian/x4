import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent {
  constructor(public activeModal: NgbActiveModal) {
  }

  @Input()
  title: string;

  @Input()
  message: string;
}
