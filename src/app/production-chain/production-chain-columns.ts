import type { GridColumn } from '../shared/components/data-grid/data-grid.component';
import { NumberFormats } from '../core/format/number-formats';
import type { ChainNode } from './production-chain';

/** The columns of the production chain's ware table. */
export class ProductionChainColumns {
	static all(usedBy: boolean): GridColumn<ChainNode>[] {
		const raw = $localize`Raw resource`;
		return [
			{
				key: 'ware',
				caption: $localize`Ware`,
				hideable: false,
				value: (x) => x.ware.name,
				link: (x) => ['/wares', x.ware.id],
			},
			{
				key: 'method',
				caption: $localize`Method`,
				value: (x) => x.production?.name ?? raw,
			},
			{
				key: 'rate',
				caption: usedBy ? $localize`Per module/h` : $localize`Needed/h`,
				type: 'number',
				value: (x) => x.rate,
			},
			...(usedBy
				? []
				: [
						{
							key: 'modules',
							caption: $localize`Modules`,
							type: 'number',
							format: { maximumFractionDigits: 2 },
							value: (x) => (x.production ? x.modules : undefined),
						} satisfies GridColumn<ChainNode>,
						{
							key: 'value',
							caption: $localize`Value/h (avg)`,
							type: 'number',
							format: NumberFormats.WHOLE,
							value: (x) => x.rate * x.ware.price.avg,
							display: (x) => NumberFormats.compact(x.rate * x.ware.price.avg),
						} satisfies GridColumn<ChainNode>,
					]),
			{
				key: 'module',
				caption: $localize`Module`,
				value: (x) => x.module?.name ?? '',
				link: (x) => (x.module ? ['/modules', x.module.id] : undefined),
			},
		];
	}
}
