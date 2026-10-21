import {
	CdkDrag,
	CdkDragDrop,
	CdkDragHandle,
	CdkDragPreview,
	CdkDropList,
	moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, inject, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { AllModuleTypes, ModuleTypes } from '../../shared/services/data/module-types-data';
import { StationModule, WareGroup } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { WareService } from '../../shared/services/ware.service';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import {
	ModuleRow,
	RECYCLING_MODULES,
	ResourceCalculator,
	StationModuleModel,
	WareGroupModel,
} from './station-calculator.model';

@Component({
	selector: 'app-station-modules',
	imports: [FormField, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPreview, AutocompleteComponent],
	templateUrl: './station-modules.component.html',
	styleUrl: './station-modules.component.css',
})
export class StationModulesComponent {
	private readonly moduleService = inject(ModuleService);
	private readonly wareService = inject(WareService);

	readonly rows = input.required<FieldTree<ModuleRow[]>>();
	readonly modules = input.required<StationModuleModel[]>();
	readonly sunlight = input(100);
	readonly partialWorkforce = input(0);

	readonly wareGroups: WareGroupModel[] = this.createWareGroups();

	removeModule(index: number) {
		this.rows()().value.update((rows) => rows.filter((_, i) => i !== index));
	}

	addModule() {
		this.rows()().value.update((rows) => [...rows, { moduleId: '', count: 1 }]);
	}

	onSelectModule(id: string, index: number) {
		this.rows()[index].moduleId().value.set(id);
	}

	drop(event: CdkDragDrop<unknown>) {
		this.rows()().value.update((rows) => {
			const result = [...rows];
			moveItemInArray(result, event.previousIndex, event.currentIndex);
			return result;
		});
	}

	/** Adds production modules until every needed resource is produced by the station. */
	autofillModules() {
		const toModels = (rows: ModuleRow[]) =>
			rows.map(
				(x) => new StationModuleModel(this.wareService, this.moduleService, x.moduleId, Number(x.count) || 0)
			);

		const rows = this.rows()()
			.value()
			.map((x) => ({ ...x }));
		const habitat = toModels(rows).find((x) => x.module?.type === ModuleTypes.habitation);
		const method = habitat ? habitat.module.makerRace.id : 'default';

		let didChange = true;
		while (didChange) {
			didChange = false;
			const resources = ResourceCalculator.calculate(toModels(rows), this.sunlight(), this.partialWorkforce());

			for (const resource of resources) {
				if (resource.amount >= 0) {
					continue;
				}

				const module =
					this.moduleService.getModuleByWare(resource.ware.id, method) ||
					this.moduleService.getModuleByWare(resource.ware.id);
				if (module == null) {
					continue;
				}

				didChange = true;

				const product = module.product.find((x) => x.id == resource.ware.id);
				const productionWare =
					product.production.find((p) => p.method == method) ||
					product.production.find((p) => p.method == 'default');
				const productionPerHour = productionWare.amount * (3600 / productionWare.time);
				const moduleCount = Math.ceil(-resource.amount / productionPerHour);

				const existing = rows.find((m) => m.moduleId == module.id);
				if (existing == null) {
					rows.push({ moduleId: module.id, count: moduleCount });
				} else {
					existing.count += moduleCount;
				}
			}
		}

		this.rows()().value.set(rows);
	}

	private createWareGroups() {
		const groups: Record<string, WareGroupModel & { group: WareGroup | string }> = {};
		for (const item of this.moduleService.getModulesByType(ModuleTypes.production)) {
			if (RECYCLING_MODULES.includes(item.id)) {
				groups[ModuleTypes.recycling] ??= {
					name: ModuleTypes.recycling,
					group: ModuleTypes.recycling,
					modules: [],
				};
				groups[ModuleTypes.recycling].modules.push(item);
				continue;
			}

			for (const product of item.product) {
				groups[product.group.id] ??= { name: product.group.name, group: product.group, modules: [] };
				groups[product.group.id].modules.push(item);
			}
		}

		const result: WareGroupModel[] = Object.values(groups).sort((a, b) =>
			this.wareService.compareGroups(a.group as WareGroup, b.group as WareGroup)
		);

		for (const type of AllModuleTypes) {
			result.push({ name: type, modules: this.moduleService.getModulesByType(type) as StationModule[] });
		}
		return result;
	}
}
