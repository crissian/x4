import { Component, computed, input } from '@angular/core';
import type { TerraformingRangeData, TerraformingStatData } from '../../shared/services/data/terraforming-data';
import type { TerraformingCatalog, TerraformingScaleCell } from '../terraforming-catalog';

/** A planet stat with its value, the range the value falls in and the stat's scale. */
interface StatView {
	stat: TerraformingStatData;
	value: number;
	range?: TerraformingRangeData;
	scale: TerraformingScaleCell[];
}

/**
 * A planet's stats as the game's terraforming menu draws them: a block per value from 1 to the last range's end in
 * its range's colour, filled up to the planet's value (ui/addons/ego_detailmonitor/menu_terraforming.lua:378-392),
 * with the description of the range the value is in. Stats without ranges show the value only (:394).
 */
@Component({
	selector: 'app-terraforming-stats',
	templateUrl: './terraforming-stats.component.html',
	styleUrl: './terraforming-stats.component.css',
})
export class TerraformingStatsComponent {
	readonly catalog = input.required<TerraformingCatalog>();
	/** stat id -> value */
	readonly stats = input.required<Readonly<Record<string, number>>>();

	protected readonly rows = computed<StatView[]>(() => {
		const catalog = this.catalog();
		const stats = this.stats();
		return catalog.stats
			.filter((x) => stats[x.id] !== undefined)
			.map((stat) => {
				const value = stats[stat.id];
				return { stat, value, range: catalog.range(stat, value), scale: catalog.scale(stat) };
			});
	});
}
