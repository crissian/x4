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
 * A planet's stats on the game's own ranges: each whole value of the scale in its range's colour, the planet's
 * value marked, and the range's description. Stats without ranges show the value only.
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
