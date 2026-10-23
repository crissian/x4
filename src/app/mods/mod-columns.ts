import type { GridColumn, GridDot } from '../shared/components/data-grid/grid-column';
import type { EquipmentModService } from '../shared/services/equipment-mod.service';
import type { EquipmentMod, ModEffect } from '../shared/services/model/equipment-mod';
import { type EffectTone, ModEffects } from './mod-effects';
import { ModSlots } from './mod-slots';

/** The data grid columns of equipment mod lists. */
export class ModColumns {
	private static readonly DOTS: Record<EffectTone, GridDot> = {
		good: { tone: 'green', level: 3 },
		bad: { tone: 'red', level: 3 },
		mixed: { tone: 'amber', level: 3 },
	};

	/**
	 * Name, slot, quality, main effect and its range, bonus effects, research, price. `slot: false` drops the slot;
	 * `pageFilters` drops the grid filters of the slot, quality and stat, for a page that has its own.
	 */
	static of(
		service: EquipmentModService,
		options: { slot?: boolean; pageFilters?: boolean } = {}
	): GridColumn<EquipmentMod>[] {
		const filterable = !options.pageFilters;
		const stat = (effect: ModEffect) => service.stat(effect.stat);
		const columns: GridColumn<EquipmentMod>[] = [
			{ key: 'shortName', caption: $localize`Name`, link: (x) => ['/mods', x.id], title: (x) => x.name },
			{
				key: 'slot',
				caption: $localize`:mod slot:Slot`,
				filterable,
				lookup: ModSlots.ALL.map((x) => ({ value: x, label: ModSlots.label(x) })),
			},
			{
				key: 'quality',
				caption: $localize`Quality`,
				filterable,
				lookup: service.qualities.map((x) => ({ value: x.id, label: x.name })),
			},
			{
				key: 'effect.stat',
				caption: $localize`Main effect`,
				filterable,
				lookup: service.stats.map((x) => ({ value: x.id, label: x.name })),
			},
			{
				key: 'range',
				caption: $localize`Range`,
				type: 'number',
				value: (x) => ModEffects.best(stat(x.effect), x.effect),
				display: (x) => ModEffects.range(stat(x.effect), x.effect),
				dot: (x) => ModColumns.DOTS[ModEffects.tone(stat(x.effect), x.effect)],
				filterable: false,
			},
			{
				key: 'bonus',
				caption: $localize`Bonus effects`,
				value: (x) =>
					x.bonus?.effects
						.map((e) => `${stat(e)?.name ?? e.stat} ${ModEffects.range(stat(e), e)}`)
						.join(', ') ?? '',
			},
			{
				key: 'research',
				caption: $localize`Research`,
				hidden: true,
				value: (x) => x.research?.map((r) => service.research(r)).join(', ') ?? '',
			},
			{ key: 'price.avg', caption: $localize`Price`, type: 'number', hidden: true },
		];
		return options.slot === false ? columns.filter((x) => x.key !== 'slot') : columns;
	}
}
