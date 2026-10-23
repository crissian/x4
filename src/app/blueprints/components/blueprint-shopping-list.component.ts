import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataGridComponent, GridColumn, SortState } from '../../shared/components/data-grid/data-grid.component';
import { BlueprintCatalog } from '../blueprint-catalog';
import { BlueprintCategories } from '../blueprint-categories';
import type { BlueprintItem, UnsoldEntry, UnsoldReason } from '../blueprint-model';
import { BlueprintsStore, type ReputationRow } from '../blueprints-store';
import { BlueprintItemLinkComponent } from './blueprint-item-link.component';

/** The missing blueprints: what to buy now from whom, what needs more reputation and what no faction sells. */
@Component({
	selector: 'app-blueprint-shopping-list',
	imports: [BlueprintItemLinkComponent, DataGridComponent, DecimalPipe, RouterLink],
	templateUrl: './blueprint-shopping-list.component.html',
})
export class BlueprintShoppingListComponent {
	protected readonly store = inject(BlueprintsStore);

	private static readonly REASONS: Record<UnsoldReason, string> = {
		research: $localize`:blueprint source:Research`,
		terraforming: $localize`:blueprint source:Terraforming`,
		gamestart: $localize`:blueprint source:Game start`,
		story: $localize`:blueprint source:Story or mission`,
		unknown: $localize`:blueprint source:Unknown source`,
	};

	protected readonly reputationSort: SortState = { key: 'gap', direction: 1 };
	protected readonly reputationTrackBy = (row: ReputationRow) => `${row.item.id}~${row.seller.faction.id}`;
	protected readonly reputationColumns: GridColumn<ReputationRow>[] = [
		this.itemColumn((x) => x.item),
		{
			key: 'licence',
			caption: $localize`Licence`,
			value: (x) => x.seller.license?.name ?? x.item.license,
		},
		{
			key: 'seller',
			caption: $localize`Seller`,
			value: (x) => x.seller.faction.name,
			link: (x) => ['/factions', x.seller.faction.id],
		},
		{
			key: 'needed',
			caption: $localize`Reputation needed`,
			type: 'number',
			value: (x) => x.seller.needed,
			display: (x) => (x.seller.needed == null ? '?' : `${x.seller.needed}`),
		},
		{ key: 'current', caption: $localize`Your reputation`, type: 'number', value: (x) => x.seller.current },
		{
			key: 'gap',
			caption: $localize`Missing`,
			type: 'number',
			value: (x) => x.seller.gap,
			sortValue: (x) => x.seller.gap ?? Number.POSITIVE_INFINITY,
			display: (x) => (x.seller.gap == null ? '?' : `${x.seller.gap}`),
		},
		this.priceColumn((x) => x.item),
		{
			key: 'note',
			caption: $localize`Note`,
			value: (x) =>
				x.seller.pending
					? $localize`Reputation reached: the licence comes with a ceremony or a visit to the representative`
					: '',
			sortable: false,
		},
	];

	protected readonly unsoldSort: SortState = { key: 'item', direction: 1 };
	protected readonly unsoldTrackBy = (row: UnsoldEntry) => row.item.id;
	protected readonly unsoldColumns: GridColumn<UnsoldEntry>[] = [
		this.itemColumn((x) => x.item),
		{
			key: 'category',
			caption: $localize`Category`,
			value: (x) => BlueprintCategories.get(x.item.category)?.label ?? x.item.category,
		},
		{
			key: 'reason',
			caption: $localize`Source`,
			value: (x) => x.reason,
			lookup: Object.entries(BlueprintShoppingListComponent.REASONS).map(([value, label]) => ({ value, label })),
		},
		this.priceColumn((x) => x.item),
	];

	private itemColumn<T>(item: (row: T) => BlueprintItem): GridColumn<T> {
		return {
			key: 'item',
			caption: $localize`Blueprint`,
			value: (x) => item(x).name,
			link: (x) => BlueprintCatalog.link(item(x)),
		};
	}

	private priceColumn<T>(item: (row: T) => BlueprintItem): GridColumn<T> {
		return { key: 'price', caption: $localize`Game price (Cr)`, type: 'number', value: (x) => item(x).price };
	}
}
