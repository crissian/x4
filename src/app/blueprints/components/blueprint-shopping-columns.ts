import type { GridColumn, SortState } from '../../shared/components/data-grid/data-grid.component';
import { BlueprintCategories } from '../blueprint-categories';
import type {
	BlueprintItem,
	BlueprintSeller,
	BuyEntry,
	ReputationEntry,
	UnsoldEntry,
	UnsoldReason,
} from '../blueprint-model';

/**
 * The data grid columns of the shopping list sections, one row per blueprint. The blueprint and seller cells are
 * rendered by templates of the shopping list; their values here filter and sort.
 */
export class BlueprintShoppingColumns {
	private static readonly REASONS: Record<UnsoldReason, string> = {
		research: $localize`:blueprint source:Research`,
		terraforming: $localize`:blueprint source:Terraforming`,
		gamestart: $localize`:blueprint source:Game start`,
		story: $localize`:blueprint source:Story or mission`,
		unknown: $localize`:blueprint source:Unknown source`,
	};

	readonly itemSort: SortState = { key: 'item', direction: 1 };
	readonly gapSort: SortState = { key: 'gap', direction: 1 };

	readonly buy: GridColumn<BuyEntry>[] = [
		this.item(),
		this.category(),
		this.price(),
		{
			key: 'sellers',
			caption: $localize`Sellers`,
			value: (x) => this.names(x.sellers),
			sortValue: (x) => x.sellers.length,
		},
	];

	readonly reputation: GridColumn<ReputationEntry>[] = [
		this.item(),
		{ ...this.category(), hidden: true },
		{
			key: 'licence',
			caption: $localize`Licence`,
			value: (x) => x.sellers[0].license?.name ?? x.item.license,
		},
		{ key: 'seller', caption: $localize`Seller`, value: (x) => x.sellers[0].faction.name },
		{
			key: 'needed',
			caption: $localize`Reputation needed`,
			type: 'number',
			value: (x) => x.sellers[0].needed,
			display: (x) => (x.sellers[0].needed == null ? '?' : `${x.sellers[0].needed}`),
		},
		{ key: 'current', caption: $localize`Your reputation`, type: 'number', value: (x) => x.sellers[0].current },
		{
			key: 'gap',
			caption: $localize`Missing`,
			type: 'number',
			value: (x) => x.sellers[0].gap,
			sortValue: (x) => x.sellers[0].gap ?? Number.POSITIVE_INFINITY,
			display: (x) => (x.sellers[0].gap == null ? '?' : `${x.sellers[0].gap}`),
		},
		this.price(),
		{
			key: 'others',
			caption: $localize`Other sellers`,
			value: (x) => this.names(x.sellers.slice(1)),
			sortValue: (x) => x.sellers.length,
		},
		{
			key: 'note',
			caption: $localize`Note`,
			value: (x) =>
				x.sellers[0].pending
					? $localize`Reputation reached: the licence comes with a ceremony or a visit to the representative`
					: '',
			sortable: false,
		},
	];

	readonly unsold: GridColumn<UnsoldEntry>[] = [
		this.item(),
		this.category(),
		{
			key: 'reason',
			caption: $localize`Source`,
			value: (x) => x.reason,
			lookup: Object.entries(BlueprintShoppingColumns.REASONS).map(([value, label]) => ({ value, label })),
		},
		this.price(),
	];

	/** The name, and the variant id that tells alike names apart. */
	private item<T extends { item: BlueprintItem }>(): GridColumn<T> {
		return {
			key: 'item',
			caption: $localize`Blueprint`,
			value: (x) => (x.item.variant ? `${x.item.name} ${x.item.variant}` : x.item.name),
			hideable: false,
		};
	}

	private category<T extends { item: BlueprintItem }>(): GridColumn<T> {
		return {
			key: 'category',
			caption: $localize`Category`,
			value: (x) => BlueprintCategories.get(x.item.category)?.label ?? x.item.category,
		};
	}

	private price<T extends { item: BlueprintItem }>(): GridColumn<T> {
		return { key: 'price', caption: $localize`Game price (Cr)`, type: 'number', value: (x) => x.item.price };
	}

	private names(sellers: readonly BlueprintSeller[]): string {
		return sellers.map((x) => x.faction.name).join(', ');
	}
}
