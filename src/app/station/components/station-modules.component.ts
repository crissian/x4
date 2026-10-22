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
import { LucideGripVertical, LucideTrash, LucideSquarePlus, LucideWandSparkles } from '@lucide/angular';
import { AllModuleTypes, ModuleTypes } from '../../shared/services/data/module-types-data';
import { StationModule, WareGroup } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { WareService } from '../../shared/services/ware.service';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { StationAutofill } from './station-autofill';
import { ModuleRow, StationModuleModel, WareGroupModel, StationCalculatorModel } from './station-calculator.model';

@Component({
	selector: 'app-station-modules',
	imports: [
		FormField,
		CdkDropList,
		CdkDrag,
		CdkDragHandle,
		CdkDragPreview,
		AutocompleteComponent,
		LucideGripVertical,
		LucideTrash,
		LucideSquarePlus,
		LucideWandSparkles,
	],
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

	protected readonly selectText = $localize`:@@select:( Select )`;
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
		this.rows()().value.set(
			StationAutofill.fill(
				this.wareService,
				this.moduleService,
				this.rows()().value(),
				this.sunlight(),
				this.partialWorkforce()
			)
		);
	}

	private createWareGroups() {
		const groups: Record<string, WareGroupModel & { group: WareGroup | string }> = {};
		for (const item of this.moduleService.getModulesByType(ModuleTypes.production)) {
			if (StationCalculatorModel.isRecycler(item)) {
				groups[ModuleTypes.recycling] ??= {
					name: ModuleTypes.recycling,
					group: ModuleTypes.recycling,
					modules: [],
				};
				groups[ModuleTypes.recycling].modules.push(item);
				continue;
			}

			for (const product of item.product ?? []) {
				const group = product.group;
				if (group) {
					groups[group.id] ??= { name: group.name, group, modules: [] };
					groups[group.id].modules.push(item);
				}
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
