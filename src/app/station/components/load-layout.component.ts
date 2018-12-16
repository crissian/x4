import { ComponentBase } from '../../shared/components/component-base';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LayoutService } from '../services/layout-service';
import {Module, ModuleDefinition} from '../../shared/services/module';

interface LayoutModule {
  count: number;
  module: ModuleDefinition;
}

interface LayoutData {
  name: string;
  modules: LayoutModule[];
}

@Component({
  templateUrl: './load-layout.component.html'
})
export class LoadLayoutComponent extends ComponentBase implements OnInit {
  entities: LayoutData[];

  constructor(public activeModal: NgbActiveModal, private layoutService: LayoutService) {
    super();
  }

  ngOnInit(): void {
    this.entities = this.layoutService
      .getLayouts()
      .map<LayoutData>(x => {
        return {
          name: x.name,
          modules: x.config
            .map<LayoutModule>(y => {
              return { count: y.count, module: Module.get(y.moduleId) };
            })
        };
      });
  }

  getModules(item: LayoutData) {
    return item.modules.map(x => x.count + ' x ' + (x.module == null ? '' : x.module.name)).join(', ');
  }

  deleteLayout(item: LayoutData) {
  }
}
