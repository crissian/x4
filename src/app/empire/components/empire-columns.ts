import { EnumLabels } from '../../core/enum-labels';
import { NumberFormats } from '../../core/format/number-formats';
import type { GridColumn } from '../../shared/components/data-grid/data-grid.component';
import type { EmpireShipRow, EmpireStationRow } from '../empire-model';

/** The columns of the empire page's ship and station tables. */
export class EmpireColumns {
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
			{ key: 'purpose', caption: $localize`Role`, display: (x) => (x.purpose ? EnumLabels.label(x.purpose) : '') },
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
			{ key: 'ships', caption: $localize`Ships`, type: 'number', display: (x) => (x.ships ? NumberFormats.whole(x.ships) : '') },
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
