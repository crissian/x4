import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { LucideChevronsDown, LucideChevronsUp } from '@lucide/angular';
import { Ware } from '../../../shared/services/model/model';
import { WareService } from '../../../shared/services/ware.service';
import { StationModuleModel, StationSettings } from '../station-calculator.model';
import { ExpandState, StationSummaryPrices } from './station-summary.shared';

interface ModuleCostItem {
	ware: Ware;
	amount: number;
	price: number;
}

interface ModuleCost {
	key: string;
	name: string;
	count: number;
	price: number;
	items: ModuleCostItem[];
}

/** Price of the wares needed to build the station modules. */
@Component({
	selector: 'app-station-costs',
	imports: [DecimalPipe, FormField, LucideChevronsDown, LucideChevronsUp],
	templateUrl: './station-costs.component.html',
})
export class StationCostsComponent {
	private readonly wareService = inject(WareService);

	readonly modules = input.required<StationModuleModel[]>();
	readonly settings = input.required<FieldTree<StationSettings>>();

	protected readonly expand = new ExpandState();
	protected readonly priceLabel = StationSummaryPrices.priceLabel;

	readonly moduleCosts = computed<ModuleCost[]>(() => {
		const percentage = this.settings()().value().modulesResourcesPrice;
		const result: ModuleCost[] = [];

		this.modules().forEach((item, index) => {
			const module = item.module;
			const production = module?.production[0];
			if (!module || !production) {
				return;
			}

			const items = production.wares.flatMap((x) => {
				const ware = this.wareService.getEntity(x.ware);
				return ware ? [{ ware, amount: x.amount, price: x.amount * StationSummaryPrices.priceAt(ware, percentage) }] : [];
			});

			result.push({
				key: `${index}:${module.id}`,
				name: module.name,
				count: item.count,
				price: item.count * items.reduce((sum, x) => sum + x.price, 0),
				items,
			});
		});

		return result;
	});

	readonly totalModuleCost = computed(() => this.moduleCosts().reduce((sum, x) => sum + x.price, 0));

	readonly totalModuleResourceCosts = computed(() => {
		const totals = new Map<string, { ware: Ware; value: number }>();
		for (const cost of this.moduleCosts()) {
			for (const item of cost.items) {
				const total = totals.get(item.ware.id) ?? { ware: item.ware, value: 0 };
				total.value += cost.count * item.amount;
				totals.set(item.ware.id, total);
			}
		}
		return [...totals.values()];
	});
}
