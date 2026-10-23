import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataGridComponent, GridColumn, SortState } from '../../shared/components/data-grid/data-grid.component';
import { TradeRules, type TradeRoute } from '../trade-route-model';
import { TradeRouteRow, TradeRoutesStore } from '../trade-routes-store';
import { TradeRouteDetailsComponent } from './trade-route-details.component';
import { TradeRouteFiltersComponent } from './trade-route-filters.component';
import { Duration } from '../../core/format/duration';
import { SavePageComponent } from '../../shared/components/save-page/save-page.component';

/** Ranks the buy-here, sell-there trades of the active save by profit per minute. */
@Component({
	imports: [DataGridComponent, RouterLink, SavePageComponent, TradeRouteDetailsComponent, TradeRouteFiltersComponent],
	templateUrl: './trade-routes-page.component.html',
	providers: [TradeRoutesStore],
})
export default class TradeRoutesPageComponent {
	protected readonly store = inject(TradeRoutesStore);
	protected readonly maxRows = TradeRules.MAX_ROWS;
	protected readonly sort: SortState = { key: 'profitPerMinute', direction: -1 };
	protected readonly trackBy = (row: TradeRouteRow) => row;

	private static readonly MARKERS: {
		on(route: TradeRoute): boolean;
		label(route: TradeRoute): string;
		title: string;
	}[] = [
		{
			on: (x) => x.playerOnly,
			label: () => $localize`:trade route marker:player only`,
			title: $localize`An offer made only to you (shady dealings)`,
		},
		{
			on: (x) => x.illegalSectors.length > 0,
			label: (x) => $localize`:trade route marker:illegal (${x.illegalSectors.length}:count:)`,
			title: $localize`Illegal in a sector on the loaded leg, the seller's and the buyer's included; the police may scan your ship`,
		},
		{
			on: (x) => x.thin,
			label: () => $localize`:trade route marker:thin`,
			title: $localize`Less than a tenth of a full hold; the offer may be gone when you arrive`,
		},
	];
	private static readonly PRICE: Intl.NumberFormatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

	private readonly baseColumns: GridColumn<TradeRouteRow>[] = [
		{ key: 'ware', caption: $localize`Ware`, link: (x) => ['/wares', x.route.ware] },
		this.stationColumn('seller', $localize`Buy at`),
		{
			key: 'buyPrice',
			caption: $localize`Buy price`,
			type: 'number',
			format: TradeRoutesPageComponent.PRICE,
			value: (x) => x.route.buyPrice,
			hidden: true,
		},
		this.stationColumn('buyer', $localize`Sell at`),
		{
			key: 'sellPrice',
			caption: $localize`Sell price`,
			type: 'number',
			format: TradeRoutesPageComponent.PRICE,
			value: (x) => x.route.sellPrice,
			hidden: true,
		},
		{
			key: 'margin',
			caption: $localize`Margin`,
			type: 'number',
			format: TradeRoutesPageComponent.PRICE,
			value: (x) => x.route.margin,
		},
		this.numberColumn('units', $localize`Units`, true),
		this.numberColumn('profit', $localize`Profit/trip`),
		this.numberColumn('jumps', $localize`Jumps`, true),
	];
	private readonly startColumn = this.timeColumn('startSeconds', $localize`To start`);
	private readonly endColumns: GridColumn<TradeRouteRow>[] = [
		this.timeColumn('seconds', $localize`Time`),
		this.numberColumn('profitPerMinute', $localize`Profit/min`),
		{
			key: 'notes',
			caption: $localize`Notes`,
			value: (x) =>
				TradeRoutesPageComponent.markers(x.route)
					.map((m) => m.label(x.route))
					.join(', '),
			title: (x) =>
				TradeRoutesPageComponent.markers(x.route)
					.map((m) => m.title)
					.join('\n') || undefined,
			sortable: false,
		},
	];
	/** The empty leg column shows only with a near sector. */
	protected readonly columns = computed(() => [
		...this.baseColumns,
		...(this.store.near() ? [this.startColumn] : []),
		...this.endColumns,
	]);

	private static markers(route: TradeRoute) {
		return TradeRoutesPageComponent.MARKERS.filter((x) => x.on(route));
	}

	private stationColumn(side: 'seller' | 'buyer', caption: string): GridColumn<TradeRouteRow> {
		const sector = side === 'seller' ? 'sellerSector' : 'buyerSector';
		return {
			key: side,
			caption,
			value: (x) => `${x[side]} · ${x[sector]}`,
			link: (x) => ['/sectors', x.route[side].sector],
			title: (x) => `${x[side]} (${x.route[side].code})`,
			queryParams: (x) => ({ station: x.route[side].code }),
		};
	}

	private numberColumn(
		key: 'units' | 'profit' | 'jumps' | 'profitPerMinute',
		caption: string,
		hidden = false
	): GridColumn<TradeRouteRow> {
		return { key, caption, type: 'number', value: (x) => x.route[key], hidden };
	}

	private timeColumn(key: 'seconds' | 'startSeconds', caption: string): GridColumn<TradeRouteRow> {
		return {
			key,
			caption,
			type: 'number',
			value: (x) => x.route[key],
			display: (x) => Duration.short(x.route[key]),
		};
	}
}
