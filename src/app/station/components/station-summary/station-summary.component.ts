import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { LucideChevronsDown, LucideChevronsUp, LucideTrendingUp } from '@lucide/angular';
import { WareGroups } from '../../../shared/services/data/ware-groups-data';
import { Ware } from '../../../shared/services/model/model';
import { WareService } from '../../../shared/services/ware.service';
import { StationModuleModel, StationResourceModel, StationSettings } from '../station-calculator.model';

const BASIC_RESOURCES = [WareGroups.gases, WareGroups.minerals, WareGroups.ice];
const HQ_WORKFORCE = 200;

interface WorkforceItem {
	amount: number;
	name: string;
	count: number;
}

interface ResourceSummary {
	name: string;
	amount: number;
	price: number;
}

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

/** Ware price between min (0%) and max (100%) */
function priceAt(ware: Ware, percentage: number) {
	return ware.price.min + ((ware.price.max - ware.price.min) * percentage) / 100;
}

/**
 * The Station Summary component
 */
@Component({
	selector: 'app-station-summary',
	imports: [DecimalPipe, FormField, LucideChevronsDown, LucideChevronsUp, LucideTrendingUp],
	templateUrl: './station-summary.component.html',
})
export class StationSummaryComponent {
	private readonly wareService = inject(WareService);

	readonly modules = input.required<StationModuleModel[]>();
	readonly resources = input.required<StationResourceModel[]>();
	readonly workforce = input.required<{ value: number; capacity: number }>();
	readonly settings = input.required<FieldTree<StationSettings>>();

	readonly expandState = signal<Record<string, boolean>>({});

	private readonly values = computed(() => this.settings()().value());

	readonly hqWorkforce = HQ_WORKFORCE;
	readonly totalWorkforce = computed(() => this.workforce().value + (this.values().isHq ? HQ_WORKFORCE : 0));
	readonly totalWorkforceCapacity = computed(() => this.workforce().capacity);

	readonly workforceNeeded = computed<WorkforceItem[]>(() =>
		this.modules()
			.filter((x) => x.module?.workForce?.max != null)
			.map((x) => ({ amount: x.module.workForce.max, name: x.module.name, count: x.count }))
	);

	readonly workforceCapacity = computed<WorkforceItem[]>(() =>
		this.modules()
			.filter((x) => x.module?.workForce?.capacity != null)
			.map((x) => ({ amount: x.module.workForce.capacity, name: x.module.name, count: x.count }))
	);

	readonly workforceStep = computed(() => {
		const capacity = this.totalWorkforceCapacity();
		return capacity === 0 ? 1 : capacity / 20;
	});

	readonly workforcePercent = computed(() => {
		const capacity = this.totalWorkforceCapacity();
		return capacity === 0 ? '0%' : Math.round((100 * this.values().partialWorkforce) / capacity) + '%';
	});

	private readonly sortedResources = computed(() =>
		[...this.resources()].sort((a, b) => this.wareService.compareWares(a.ware, b.ware))
	);

	readonly resourcesNeeded = computed<ResourceSummary[]>(() => {
		const settings = this.values();
		return this.sortedResources()
			.filter((x) => x.amount < 0)
			.map((x) => {
				const provided =
					settings.provideAllResources ||
					(settings.provideBasicResources && BASIC_RESOURCES.indexOf(x.ware.group) >= 0);
				return {
					name: x.ware.name,
					amount: x.amount,
					price: provided ? 0 : priceAt(x.ware, settings.resourcesPrice),
				};
			});
	});

	readonly resourcesProduced = computed<ResourceSummary[]>(() => {
		const percentage = this.values().productsPrice;
		return this.sortedResources()
			.filter((x) => x.amount > 0)
			.map((x) => ({ name: x.ware.name, amount: x.amount, price: priceAt(x.ware, percentage) }));
	});

	readonly totalExpenses = computed(() => this.resourcesNeeded().reduce((sum, x) => sum + x.amount * x.price, 0));
	readonly totalProfits = computed(() => this.resourcesProduced().reduce((sum, x) => sum + x.amount * x.price, 0));

	readonly moduleCosts = computed<ModuleCost[]>(() => {
		const percentage = this.values().modulesResourcesPrice;
		const result: ModuleCost[] = [];

		this.modules().forEach((item, index) => {
			const production = item.module?.production[0];
			if (!production) {
				return;
			}

			const items = production.wares.map((x) => {
				const ware = this.wareService.getEntity(x.ware);
				return { ware, amount: x.amount, price: x.amount * priceAt(ware, percentage) };
			});

			result.push({
				key: `${index}:${item.module.id}`,
				name: item.module.name,
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

	toggleExpanded(key: string) {
		this.expandState.update((state) => ({ ...state, [key]: !state[key] }));
	}

	/** label of a price slider value */
	priceLabel(value: number) {
		switch (value) {
			case 0:
				return $localize`:@@min:Min`;
			case 50:
				return $localize`:@@average:Average`;
			case 100:
				return $localize`:@@max:Max`;
			default:
				return `${value}%`;
		}
	}
}
