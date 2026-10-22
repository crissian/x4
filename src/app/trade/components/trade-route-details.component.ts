import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouteMapComponent } from '../../map/route-map/route-map.component';
import { RoutePlanner, RouteStep, StepType } from '../../map/route-planner';
import { TradeRouteRow, TradeRoutesStore } from '../trade-routes-store';

/** The selected trade route: its map, the sectors on the way, and the seller's stock and buyer's demand. */
@Component({
	selector: 'app-trade-route-details',
	imports: [DecimalPipe, RouteMapComponent, RouterLink],
	templateUrl: './trade-route-details.component.html',
})
export class TradeRouteDetailsComponent {
	readonly row = input.required<TradeRouteRow>();
	/** The sectors from the seller to the buyer. */
	readonly steps = input.required<readonly RouteStep[]>();

	protected readonly path = computed(() => this.steps().map((x) => x.sector.id));
	/** The sectors on the loaded leg where the ware is illegal. */
	protected readonly illegal = computed(() => {
		const ids = this.row().route.illegalSectors;
		return this.steps()
			.map((x) => x.sector)
			.filter((x) => ids.includes(x.id));
	});
	protected readonly stock = computed(() => TradeRoutesStore.amount(this.row().route.seller, this.row().route, true));
	protected readonly demand = computed(() =>
		TradeRoutesStore.amount(this.row().route.buyer, this.row().route, false)
	);
	protected readonly duration = RoutePlanner.formatDuration;
	protected readonly stepLabels: Record<Exclude<StepType, 'start'>, string> = {
		gate: $localize`gate`,
		accelerator: $localize`accelerator`,
		highway: $localize`highway`,
	};
}
