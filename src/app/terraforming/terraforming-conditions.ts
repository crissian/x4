import type { TerraformingConditionData } from '../shared/services/data/terraforming-data';
import type { TerraformingCatalog } from './terraforming-catalog';

/**
 * Whether a planet's stats meet a project's conditions. `min`/`max` are read as bounds of the state of the range
 * the stat's value falls in, `minValue`/`maxValue` as bounds of the value itself.
 */
export class TerraformingConditions {
	constructor(private readonly catalog: TerraformingCatalog) {}

	/** True or false, undefined when the planet doesn't have the stat or it has no ranges to take a state from. */
	met(condition: TerraformingConditionData, stats: Readonly<Record<string, number>>): boolean | undefined {
		const value = stats[condition.stat];
		if (value === undefined) {
			return undefined;
		}
		if (condition.minValue !== undefined && value < condition.minValue) {
			return false;
		}
		if (condition.maxValue !== undefined && value > condition.maxValue) {
			return false;
		}
		if (condition.min === undefined && condition.max === undefined) {
			return true;
		}
		const stat = this.catalog.stat(condition.stat);
		const range = stat && this.catalog.range(stat, value);
		if (!range) {
			return undefined;
		}
		return (
			(condition.min === undefined || range.state >= condition.min) &&
			(condition.max === undefined || range.state <= condition.max)
		);
	}

	/** False when any condition fails, undefined when none fails but one can't be told, else true. */
	all(
		conditions: readonly TerraformingConditionData[],
		stats: Readonly<Record<string, number>>
	): boolean | undefined {
		const results = conditions.map((x) => this.met(x, stats));
		if (results.includes(false)) {
			return false;
		}
		return results.includes(undefined) ? undefined : true;
	}
}
