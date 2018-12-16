import { ComponentBase } from '../../shared/components/component-base';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LayoutService } from '../services/layout-service';
import { Layout } from '../../shared/services/module-config';
import { Module } from '../../shared/services/module';

class LayoutData {

}

@Component({
  templateUrl: './load-layout.component.html'
})
export class LoadLayoutComponent extends ComponentBase implements OnInit {
  entities: Layout[];

  constructor(public activeModal: NgbActiveModal, private layoutService: LayoutService) {
    super();
  }

  ngOnInit(): void {
    this.entities = this.layoutService.getLayouts();
    this.entities.forEach(x => {
      //Module.get()
    });
  }
}
