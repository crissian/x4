import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModuleTypes} from '../../shared/services/data/module-types-data';
import {StationModule} from '../../shared/services/model/model';
import {ModuleService} from '../../shared/services/module.service';
import {WareService} from '../../shared/services/ware.service';
import {ResourceCalculator, StationModuleModel, StationResourceModel, WareGroupModel} from './station-calculator.model';

@Component({
   selector: 'app-station-modules',
   templateUrl: './station-modules.component.html',
   styleUrls: ['./station-modules.component.scss'],
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

      this.wareGroups.push({name: ModuleTypes.habitation, modules: this.moduleService.getModulesByType(ModuleTypes.habitation)});
      this.wareGroups.push({name: ModuleTypes.buildmodule, modules: this.moduleService.getModulesByType(ModuleTypes.buildmodule)});
      this.wareGroups.push({name: ModuleTypes.dockarea, modules: this.moduleService.getModulesByType(ModuleTypes.dockarea)});
      this.wareGroups.push({name: ModuleTypes.pier, modules: this.moduleService.getModulesByType(ModuleTypes.pier)});
      this.wareGroups.push({name: ModuleTypes.storage, modules: this.moduleService.getModulesByType(ModuleTypes.storage)});
      this.wareGroups.push({name: ModuleTypes.defencemodule, modules: this.moduleService.getModulesByType(ModuleTypes.defencemodule)});
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

   backfillModules() {
      while (true) {
         const resources: StationResourceModel[] = ResourceCalculator.calculate(this.modules, 0, 0);
         let didChange = false;

         const modules = this.modules;

         for (const resource of resources) {
            if (resource.amount >= 0) {
               continue;
            }

            const module = this.moduleService.getModuleByWare(resource.ware.id);
            if (module == null) {
               continue;
            }
            didChange = true;

            const productionWare = module.product.production.find(p => p.method == 'default');
            const productionPerHour = productionWare.amount * (3600 / productionWare.time);
            const moduleCount = Math.ceil(-resource.amount / productionPerHour);

            const existingModule = modules.find(m => m.module.id == module.id);
            if (existingModule == null) {
               modules.push(new StationModuleModel(this.wareService, this.moduleService, module.id, moduleCount));
            } else {
               existingModule.count += moduleCount;
            }
         }

         if (!didChange) {
            break;
         }
      }

      this.onChange();
   }

   /**
    * on module selected
    *
    * @param id module id
    * @param item the station module item
    */
   onSelectModule(id: string, item: StationModuleModel) {
      this.modules[this.modules.indexOf(item)].moduleId = id;
      this.onChange();
   }

   /**
    * move item in modules on drop
    *
    * @param event drop event
    */
   drop(event: CdkDragDrop<StationModuleModel[]>) {
      moveItemInArray(this._modules, event.previousIndex, event.currentIndex);
   }
}
