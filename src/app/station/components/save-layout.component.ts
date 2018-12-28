import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LayoutService } from '../services/layout-service';
import { ConfirmComponent } from '../../shared/components/confirm.component';

@Component({
  templateUrl: './save-layout.component.html'
})
export class SaveLayoutComponent {
  name: string;

  constructor(public activeModal: NgbActiveModal, private modal: NgbModal, private layoutService: LayoutService) {
  }

  canSave() {
    return this.name;
  }

  saveLayout() {
    const layout = this.layoutService.getLayout(this.name);
    if (layout) {
      const modalRef = this.modal.open(ConfirmComponent);
      modalRef.componentInstance.title = 'Confirm Save';
      modalRef.componentInstance.message = `<strong>${this.name}</strong> already exists. Confirm overwrite?`;
      modalRef.result.then(res => {
        if (res) {
          this.activeModal.close(this.name);
        }
      });
    } else {
      this.activeModal.close(this.name);
    }
  }
}
