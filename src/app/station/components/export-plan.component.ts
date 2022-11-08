import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface ConstructionPlan {
   macros: any[];
   stationName: string;
}

@Component({
   selector: 'app-export-plan',
   templateUrl: './export-plan.component.html'
})
export class ExportPlanComponent extends ComponentBase implements OnInit {
   macros: any[];
   stationName: string;

   constructor(public activeModal: NgbActiveModal) {
      super();
   }

   ngOnInit(): void {
   }

   exportPlan() {
      this.stationName = this.stationName ? this.stationName : "New Station";
      const plan = this.exportCore(this);
      const hiddenElement = document.createElement('a');
      hiddenElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURI(plan));
      hiddenElement.setAttribute('target', '_blank');
      hiddenElement.setAttribute('download', `${this.stationName}.xml`);
      hiddenElement.click();
      hiddenElement.remove();
      this.activeModal.close(plan);
   }

   private exportCore(plan: ConstructionPlan) {
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
      <plan id="${stationId}" name="${plan.stationName}" description="Buy me a beer, not a coffee">${entries}
      </plan>
   </plans>`

      return xml;
   }
}
