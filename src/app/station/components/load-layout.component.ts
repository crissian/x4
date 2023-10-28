import { ComponentBase } from '../../shared/components/component-base';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LayoutService } from '../services/layout-service';
import { ConfirmComponent } from '../../shared/components/confirm.component';
import { StationModule } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';

interface LayoutModule {
   count: number;
   module: StationModule;
}

interface LayoutData {
   name: string;
   modules: LayoutModule[];
}

export enum LoadLayoutType {
   load,
   add
}

export interface LoadLayoutResult {
   layoutName: string;
   type: LoadLayoutType;
}

@Component({
   templateUrl: './load-layout.component.html'
})
export class LoadLayoutComponent extends ComponentBase implements OnInit {
   entities: LayoutData[];

   constructor(public activeModal: NgbActiveModal, private modal: NgbModal,
               private layoutService: LayoutService,
               private moduleService: ModuleService) {
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
                     return { count: y.count, module: this.moduleService.getEntity(y.moduleId) };
                  })
            };
         });
   }

   // noinspection JSMethodCanBeStatic
   getModules(item: LayoutData) {
      let hasMore = false;

      let modules = item.modules;
      if (modules.length > 3) {
         modules = modules.slice(0, 3);
         hasMore = true;
      }

      return modules.map(x => x.count + ' x ' + (x.module == null ? '' : x.module.name)).join(', ') + (hasMore ? '...' : '');
   }

   loadLayout(event: any, item: LayoutData) {
      event.preventDefault();
      event.stopPropagation();

      const result: LoadLayoutResult = {
         layoutName: item.name,
         type: LoadLayoutType.load
      };

      this.activeModal.close(result);
   }

   addLayout(event: any, item: LayoutData) {
      event.preventDefault();
      event.stopPropagation();

      const result: LoadLayoutResult = {
         layoutName: item.name,
         type: LoadLayoutType.add
      };

      this.activeModal.close(result);
   }

   deleteLayout(event: any, item: LayoutData) {
      event.preventDefault();
      event.stopPropagation();

      const modalRef = this.modal.open(ConfirmComponent);
      modalRef.componentInstance.title = 'Confirm Delete';
      modalRef.componentInstance.message = `Are you sure you want to delete <strong>${item.name}</strong>?`;

      modalRef.result
         .then(res => {
            if (res) {
               this.layoutService.deleteLayout(item.name);
               this.ngOnInit();
            }
         });
   }
}
