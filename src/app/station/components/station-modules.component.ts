import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StationModuleModel, WareGroupModel } from './station-calculator.model';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import { StationModule } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { WareService } from '../../shared/services/ware.service';

@Component({
   selector: 'app-station-modules',
   templateUrl: './station-modules.component.html'
})
export class StationModulesComponent implements OnInit {
   private _modules: StationModuleModel[];
   wareGroups: WareGroupModel[];

   @Output()
   change = new EventEmitter();

   constructor(private moduleService: ModuleService, private wareService: WareService) {
   }

   get modules() {
      return this._modules;
   }

   @Input()
   set modules(value: StationModuleModel[]) {
      this._modules = value;
   }

   ngOnInit(): void {
      const groupsObj = this.moduleService.getModulesByType(ModuleTypes.production)
         .reduce((obj, item: StationModule) => {
            obj[item.product.group.id] = obj[item.product.group.id] || {
               name: item.product.group.name,
               group: item.product.group,
               modules: []
            };
            obj[item.product.group.id].modules.push(item);
            return obj;
         }, []);

      this.wareGroups = Object.keys(groupsObj)
         .map(x => groupsObj[x])
         .sort((a, b) => this.wareService.compareGroups(a.group, b.group));

      this.wareGroups.push({ name: ModuleTypes.habitation, modules: this.moduleService.getModulesByType(ModuleTypes.habitation) });
      this.wareGroups.push({ name: ModuleTypes.buildmodule, modules: this.moduleService.getModulesByType(ModuleTypes.buildmodule) });
      this.wareGroups.push({ name: ModuleTypes.dockarea, modules: this.moduleService.getModulesByType(ModuleTypes.dockarea) });
      this.wareGroups.push({ name: ModuleTypes.pier, modules: this.moduleService.getModulesByType(ModuleTypes.pier) });
      this.wareGroups.push({ name: ModuleTypes.storage, modules: this.moduleService.getModulesByType(ModuleTypes.storage) });
      this.wareGroups.push({ name: ModuleTypes.defencemodule, modules: this.moduleService.getModulesByType(ModuleTypes.defencemodule) });
   }

   removeModule(item: StationModuleModel) {
      const index = this.modules.indexOf(item);
      if (index >= 0) {
         this.modules.splice(index, 1);
         this.onChange();
      }
   }

   addModule() {
      this.modules.push(new StationModuleModel(this.wareService, this.moduleService));
   }

   onChange() {
      this.change.emit();
   }
}
