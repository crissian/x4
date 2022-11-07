import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuleService } from '../../shared/services/module.service';
import { LayoutService } from '../services/layout-service';
import { Layout, ModuleConfig } from '../../shared/services/module-config';

interface ConstructionPlan {
   macros: any;
   stationName: string;
}

@Component({
   selector: 'app-export-plan',
   templateUrl: './export-plan.component.html'
})
export class ExportPlanComponent extends ComponentBase implements OnInit {
   macros: any[];
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
      const name = plan.stationName;
      let entries = "";
      let count = 1;
      const stationId = Math.random().toString(36).slice(2);

      for (const macro of plan.macros) {
         let entryCount = 1;
         while (entryCount <= macro.count){
            entries += `
                  <entry index="${count}" macro="${macro.macro}">
                  </entry>`;
            count++;
            entryCount++;
         }
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
         <plans>
            <plan id="${stationId}" name="${name}" description="">${entries}
            </plan>
         </plans>`

      return xml;
   }

   get canExport() {
      return this.macros;
   }
}
