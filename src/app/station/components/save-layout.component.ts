import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './save-layout.component.html'
})
export class SaveLayoutComponent {
  name: string;

  constructor(public activeModal: NgbActiveModal) {
  }

  canSave() {
    return this.name;
  }
}
