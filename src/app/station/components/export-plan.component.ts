import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuleService } from '../../shared/services/module.service';
import { LayoutService } from '../services/layout-service';
import { Layout, ModuleConfig } from '../../shared/services/module-config';

interface ConstructionPlan {
   macros: string[];
   stationName: string;
}

@Component({
   selector: 'app-export-plan',
   templateUrl: './export-plan.component.html'
})
export class ExportPlanComponent extends ComponentBase implements OnInit {
   macros: string[];
   stationName: string;

   constructor(public activeModal: NgbActiveModal,
               private moduleService: ModuleService,
               private layoutService: LayoutService) {
      super();
   }

   ngOnInit(): void {
   }

   exportPlan() {
      const plan = this.exportCore(this)
      this.activeModal.close(plan);
   }

   private exportCore(plan: ConstructionPlan) {
      const value = plan;
      return value;
   }

   get canExport() {
      return this.macros;
   }
}
