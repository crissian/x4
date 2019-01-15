import { Component, Input, OnInit } from '@angular/core';
import { ResourceCalculator, StationModuleModel, StationResourceModel } from './station-calculator.model';
import { WareService } from '../../shared/services/ware.service';

@Component({
   selector: 'app-station-resources',
   templateUrl: './station-resources.component.html'
})
export class StationResourcesComponent implements OnInit {
   private expandState: { [resourceId: number]: boolean } = {};
   private _modules: StationModuleModel[];

   totalWorkforce = 0;
   totalWorkforceCapacity = 0;
   resources: StationResourceModel[] = [];

   constructor(private wareService: WareService) {
   }

   get modules() {
      return this._modules;
   }

   @Input()
   set modules(value: StationModuleModel[]) {
      this._modules = value;
      this.update();
   }

   ngOnInit(): void {
   }

   toggleExpanded(item: any) {
      item.expanded = !item.expanded;
      this.expandState[item.ware.id] = item.expanded;
   }

   update() {
      this.totalWorkforce = 0;
      this.totalWorkforceCapacity = 0;

      if (this.modules == null) {
         return;
      }

      this.modules.forEach(item => {
         if (item.module != null && item.module.workForce != null) {
            if (item.module.workForce.max != null) {
               this.totalWorkforce += item.count * item.module.workForce.max;
            }
            if (item.module.workForce.capacity != null) {
               this.totalWorkforceCapacity += item.count * item.module.workForce.capacity;
            }
         }
      });

      this.resources = ResourceCalculator.calculate(this.modules, this.totalWorkforce, this.totalWorkforceCapacity);
      this.resources.forEach(x => {
         x.expanded = this.expandState[x.items[0].ware.id];
      });

      this.resources.sort((a, b) => this.wareService.compareWares(a.ware, b.ware));
   }
}
