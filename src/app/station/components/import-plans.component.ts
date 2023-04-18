import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import * as convert from 'xml-js';
import { ModuleService } from '../../shared/services/module.service';
import { LayoutService } from '../services/layout-service';
import { Layout, ModuleConfig } from '../../shared/services/module-config';

interface EntryAttribute {
   macro: string;
}

interface Entry {
   $: EntryAttribute;
}

interface PlanAttribute {
   name: string;
}

interface Plan {
   $: PlanAttribute;
   entry: Entry[];
}

interface PlanList {
   plan: Plan[];
}

interface ConstructionPlan {
   plans: PlanList;
}

export interface ImportResult {
   error: string;
   layouts: string[];
}

@Component({
   selector: 'app-import-plans',
   templateUrl: './import-plans.component.html'
})
export class ImportPlansComponent extends ComponentBase implements OnInit {
   xml: string;

   constructor(public activeModal: NgbActiveModal,
               private moduleService: ModuleService,
               private layoutService: LayoutService) {
      super();
   }

   ngOnInit(): void {
   }

   importPlans() {
     // const converted = convert.xml2js(this.xml, { compact: true });
     // console.log(converted);
   }

   private importCore(result: ConstructionPlan) {
      const layouts: string[] = [];

      for (const plan of result.plans.plan) {
         if (plan.entry == null || plan.entry.length === 0) {
            continue;
         }

         const name = plan.$.name;

         const modules: ModuleConfig[] = [];

         for (const item of plan.entry) {
            const [ module ] = this.moduleService.getModulesByMacro(item.$.macro);
            if (module) {
               const existing = modules.find(x => x.moduleId === module.id);
               if (!existing) {
                  modules.push({ moduleId: module.id, count: 1 });
               } else {
                  existing.count++;
               }
            }
         }

         const layout: Layout = {
            name: name,
            config: modules
         };

         this.layoutService.saveLayout(layout);

         layouts.push(name);
      }

      return layouts;
   }

   get canImport() {
      return this.xml;
   }
}
