import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { LucideChevronsDown, LucideChevronsUp } from '@lucide/angular';
import { EnumLabelPipe } from '../../../core/enum-labels';
import { ModuleTypes } from '../../../shared/services/data/module-types-data';
import { WareService } from '../../../shared/services/ware.service';
import { StationModuleModel, StationResourceModel, StationSettings } from '../station-calculator.model';
import { ExpandState } from './station-summary.shared';

interface StorageItem {
	name: string;
	volume: number;
}

interface StorageType {
	type: string;
	needed: number;
	capacity: number;
	wares: StorageItem[];
	modules: StorageItem[];
}

/**
 * Storage volume the station needs per transport type to hold a number of hours of its production and consumption,
 * compared with the capacity of its storage modules.
 */
@Component({
	selector: 'app-station-storage',
	imports: [DecimalPipe, EnumLabelPipe, FormField, LucideChevronsDown, LucideChevronsUp],
	templateUrl: './station-storage.component.html',
})
export class StationStorageComponent {
	private readonly wareService = inject(WareService);

	readonly modules = input.required<StationModuleModel[]>();
	readonly resources = input.required<StationResourceModel[]>();
	readonly settings = input.required<FieldTree<StationSettings>>();

	protected readonly expand = new ExpandState();
	private readonly hours = computed(() => Math.max(0, Number(this.settings()().value().storageHours) || 0));

	readonly storage = computed<StorageType[]>(() => {
		const types = new Map<string, StorageType>();
		const typeOf = (name: string) => {
			const key = name.toLowerCase();
			let type = types.get(key);
			if (!type) {
				type = { type: name, needed: 0, capacity: 0, wares: [], modules: [] };
				types.set(key, type);
			}
			return type;
		};

		const hours = this.hours();
		const resources = [...this.resources()].sort((a, b) => this.wareService.compareWares(a.ware, b.ware));
		for (const resource of resources) {
			// wares made and used by the station still pass through its storage, so hold the larger of the two flows
			let produced = 0;
			let consumed = 0;
			for (const item of resource.items) {
				if (item.total > 0) {
					produced += item.total;
				} else {
					consumed -= item.total;
				}
			}
			const volume = Math.max(produced, consumed) * resource.ware.volume * hours;
			if (volume > 0 && resource.ware.transport) {
				const type = typeOf(resource.ware.transport);
				type.needed += volume;
				type.wares.push({ name: resource.ware.name, volume });
			}
		}

		for (const item of this.modules()) {
			const cargo = item.module?.cargo;
			if (item.module?.type === ModuleTypes.storage && cargo && item.count > 0) {
				const type = typeOf(cargo.type.name);
				const volume = cargo.max * item.count;
				type.capacity += volume;
				type.modules.push({ name: `${item.count} x ${item.module.name}`, volume });
			}
		}

		return [...types.values()];
	});
}
