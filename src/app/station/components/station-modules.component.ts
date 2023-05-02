import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AllModuleTypes, ModuleTypes } from '../../shared/services/data/module-types-data';
import { StationModule } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { WareService } from '../../shared/services/ware.service';
import { RECYCLING_MODULES, ResourceCalculator, StationModuleModel, StationResourceModel, WareGroupModel } from './station-calculator.model';
import { StationSummaryService } from './station-summary/services/station-summary.service';

@Component({
    selector: 'app-station-modules',
    templateUrl: './station-modules.component.html',
    styleUrls: [ './station-modules.component.scss' ],
})
export class StationModulesComponent implements OnInit {
    wareGroups: WareGroupModel[];

    @Output()
    change = new EventEmitter();

    @Input()
    modules: StationModuleModel[];

    @Input()
    sunlight = 100;

    constructor(private moduleService: ModuleService, private wareService: WareService, private stationSummaryService: StationSummaryService) {
    }

    ngOnInit(): void {
        const groupsObj = this.moduleService.getModulesByType(ModuleTypes.production)
            .reduce((obj, item: StationModule) => {
                if (RECYCLING_MODULES.includes(item.id)) {
                    obj[ModuleTypes.recycling] = obj[ModuleTypes.recycling] || {
                        name: ModuleTypes.recycling,
                        group: ModuleTypes.recycling,
                        modules: []
                    };
                    obj[ModuleTypes.recycling].modules.push(item);
                    return obj;
                }

                for (let product of item.product) {
                    obj[product.group.id] = obj[product.group.id] || {
                        name: product.group.name,
                        group: product.group,
                        modules: []
                    };
                    obj[product.group.id].modules.push(item);
                }
                return obj;
            }, []);

        this.wareGroups = Object.keys(groupsObj)
            .map(x => groupsObj[x])
            .sort((a, b) => this.wareService.compareGroups(a.group, b.group));

        for (const type of AllModuleTypes) {
            this.wareGroups.push({ name: type, modules: this.moduleService.getModulesByType(type) });
        }
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
        const habitat = this.modules.find(x => x.module?.type === ModuleTypes.habitation);
        let method = 'default';
        if (habitat) {
            method = habitat.module.makerRace.id;
        }

        while (true) {

            const resources: StationResourceModel[] = ResourceCalculator.calculate(this.modules, this.sunlight, this.stationSummaryService.$partialWorkforce);
            let didChange = false;

            const modules = this.modules;

            for (const resource of resources) {
                if (resource.amount >= 0) {
                    continue;
                }

                const module = this.moduleService.getModuleByWare(resource.ware.id, method) || this.moduleService.getModuleByWare(resource.ware.id);
                if (module == null) {
                    continue;
                }

                didChange = true;

                const product = module.product.find(x => x.id == resource.ware.id);

                const productionWare = product.production.find(p => p.method == method) || product.production.find(p => p.method == 'default');
                const productionPerHour = productionWare.amount * (3600 / productionWare.time);
                const moduleCount = Math.ceil(-resource.amount / productionPerHour);

                const existingModule = modules.find(m => m.module?.id == module.id);
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
        moveItemInArray(this.modules, event.previousIndex, event.currentIndex);
    }
}
