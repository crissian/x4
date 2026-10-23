import { EnumLabels } from '../../core/enum-labels';
import { NumberFormats } from '../../core/format/number-formats';
import type { GridColumn, SortState } from '../../shared/components/data-grid/data-grid.component';
import { EmpireBalance, type EmpireBalanceRow } from '../empire-balance';
import type { EmpireShipRow, EmpireStationRow } from '../empire-model';

/** The columns of the empire page's ship, station and production balance tables. */
export class EmpireColumns {
	/** The production balance opens with the largest shortage first. */
	static readonly BALANCE_SORT: SortState = { key: 'net', direction: 1 };

	/** How many stored wares a station row names. */
	private static readonly STORAGE_SHOWN = 3;

	static ships(): GridColumn<EmpireShipRow>[] {
		return [
			{ key: 'label', caption: $localize`Name`, hideable: false },
			{ key: 'code', caption: $localize`Code`, hidden: true },
			{
				key: 'modelName',
				caption: $localize`Ship`,
				link: (x) => (x.model ? ['/ships', x.modelId] : undefined),
			},
			{ key: 'size', caption: $localize`Size`, display: (x) => (x.size ? EnumLabels.label(x.size) : '') },
			{
				key: 'purpose',
				caption: $localize`Role`,
				display: (x) => (x.purpose ? EnumLabels.label(x.purpose) : ''),
			},
			{ key: 'sectorName', caption: $localize`Sector` },
			{
				key: 'order',
				caption: $localize`Order`,
				title: (x) =>
					[x.orderId, x.defaultOrder ? $localize`Default order: ${x.defaultOrder}:order:` : '']
						.filter(Boolean)
						.join(' · ') || undefined,
			},
			{
				key: 'assignment',
				caption: $localize`Assignment`,
				value: (x) => x.assignment ?? '',
				title: (x) => x.assignmentId,
			},
			{ key: 'commander', caption: $localize`Commander`, value: (x) => x.commander ?? '' },
			{ key: 'fleet', caption: $localize`Fleet`, hidden: true },
			{
				key: 'subordinates',
				caption: $localize`Subordinates`,
				type: 'number',
				display: (x) => (x.subordinates ? NumberFormats.whole(x.subordinates) : ''),
			},
		];
	}

	static stations(): GridColumn<EmpireStationRow>[] {
		return [
			{ key: 'name', caption: $localize`Name`, hideable: false },
			{ key: 'code', caption: $localize`Code`, hidden: true },
			{ key: 'sectorName', caption: $localize`Sector` },
			{ key: 'modules', caption: $localize`Modules`, type: 'number' },
			{ key: 'products', caption: $localize`Products`, value: (x) => x.products.join(', ') },
			{
				key: 'storage',
				caption: $localize`Storage`,
				type: 'number',
				value: (x) => x.storage.reduce((sum, item) => sum + item.amount, 0),
				display: (x) => EmpireColumns.storage(x),
				title: (x) => x.storage.map((item) => `${item.name}: ${NumberFormats.whole(item.amount)}`).join('\n'),
			},
			{ key: 'money', caption: $localize`Money (Cr)`, type: 'number' },
			{
				key: 'ships',
				caption: $localize`Ships`,
				type: 'number',
				display: (x) => (x.ships ? NumberFormats.whole(x.ships) : ''),
			},
			{
				key: 'calculator',
				caption: $localize`Station Calculator`,
				value: (x) => x.layout?.rows.length ?? 0,
				sortable: false,
				filterable: false,
			},
		];
	}

	static balance(): GridColumn<EmpireBalanceRow>[] {
		const perHour = (value: number) => NumberFormats.whole(Math.round(value));
		return [
			{ key: 'name', caption: $localize`Ware`, hideable: false, link: (x) => ['/wares', x.id] },
			{ key: 'produced', caption: $localize`Produced/h`, type: 'number', display: (x) => perHour(x.produced) },
			{ key: 'consumed', caption: $localize`Consumed/h`, type: 'number', display: (x) => perHour(x.consumed) },
			{
				key: 'net',
				caption: $localize`Net/h`,
				type: 'number',
				display: (x) => (x.net > 0 ? '+' : '') + perHour(x.net),
				bar: (x) => EmpireBalance.share(x),
				dot: (x) => (x.net < 0 ? { tone: 'red', level: 3 } : undefined),
			},
			{ key: 'stations', caption: $localize`Stations`, type: 'number' },
			{ key: 'chain', caption: $localize`Production Chain`, sortable: false, filterable: false },
		];
	}

	/** The largest stored wares, e.g. "Energy Cells 9,000, Water 120 +2 more". */
	private static storage(row: EmpireStationRow): string {
		const shown = row.storage
			.slice(0, EmpireColumns.STORAGE_SHOWN)
			.map((item) => `${item.name} ${NumberFormats.whole(item.amount)}`)
			.join(', ');
		const more = row.storage.length - EmpireColumns.STORAGE_SHOWN;
		return more > 0 ? $localize`${shown}:wares: +${more}:count: more` : shown;
	}
}
