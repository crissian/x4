import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { LucideChevronsDown, LucideChevronsUp, LucideTrendingUp } from '@lucide/angular';
import { WareGroups } from '../../../shared/services/data/ware-groups-data';
import { WareService } from '../../../shared/services/ware.service';
import { StationResourceModel, StationSettings } from '../station-calculator.model';
import { ExpandState, priceAt, priceLabel } from './station-summary.shared';

const BASIC_RESOURCES = [WareGroups.gases, WareGroups.minerals, WareGroups.ice];

interface ResourceSummary {
	name: string;
	amount: number;
	price: number;
}

/** Hourly expenses for the resources, income from the products and the profit. */
@Component({
	selector: 'app-station-profit',
	imports: [DecimalPipe, FormField, LucideChevronsDown, LucideChevronsUp, LucideTrendingUp],
	templateUrl: './station-profit.component.html',
})
export class StationProfitComponent {
	private readonly wareService = inject(WareService);

	readonly resources = input.required<StationResourceModel[]>();
	readonly settings = input.required<FieldTree<StationSettings>>();

	protected readonly expand = new ExpandState();
	protected readonly priceLabel = priceLabel;
	private readonly values = computed(() => this.settings()().value());

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
					(settings.provideBasicResources && x.ware.group != null && BASIC_RESOURCES.indexOf(x.ware.group) >= 0);
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
}
