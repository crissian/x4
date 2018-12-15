import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-share-layout',
  templateUrl: './share-layout.component.html'
})
export class ShareLayoutComponent {
  @Input()
  url: string;

  constructor(public activeModal: NgbActiveModal) {
  }

  copy(urlElement: any) {
    urlElement.select();
    document.execCommand('copy');
  }
}
