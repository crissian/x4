import { NumberFormats } from '../core/format/number-formats';
import type { TerraformingConditionData, TerraformingEffectData } from '../shared/services/data/terraforming-data';
import type { TerraformingCatalog, TerraformingScaleCell } from './terraforming-catalog';

/**
 * Display texts of terraforming conditions and effects, following the game's terraforming menu
 * (ui/addons/ego_detailmonitor/menu_terraforming.lua).
 */
export class TerraformingText {
	constructor(private readonly catalog: TerraformingCatalog) {}

	/**
	 * The blocks of a stat with ranges that meet a condition: values from `minValue` to `maxValue` whose range state is
	 * from `min` to `max` (menu_terraforming.lua:1213-1224). Undefined for a stat without ranges.
	 */
	conditionBlocks(condition: TerraformingConditionData): TerraformingScaleCell[] | undefined {
		const stat = this.catalog.stat(condition.stat);
		if (!stat?.ranges.length) {
			return undefined;
		}
		const { min, max, minValue, maxValue } = condition;
		return this.catalog
			.scale(stat)
			.filter(
				(x) =>
					(minValue === undefined || x.value >= minValue) &&
					(maxValue === undefined || x.value <= maxValue) &&
					(min === undefined || x.range.state >= min) &&
					(max === undefined || x.range.state <= max)
			);
	}

	/**
	 * e.g. `Temperature 4–6` (the values of the blocks that meet it) or `Housing ≥ 10,000`; undefined for a condition
	 * the menu doesn't show: on a stat without ranges and without a minimum value (menu_terraforming.lua:1200).
	 */
	condition(condition: TerraformingConditionData): string | undefined {
		const name = this.catalog.statName(condition.stat);
		const blocks = this.conditionBlocks(condition);
		if (blocks) {
			return `${name} ${TerraformingText.spans(blocks.map((x) => x.value))}`;
		}
		return condition.minValue ? `${name} ≥ ${NumberFormats.whole(condition.minValue)}` : undefined;
	}

	/** e.g. `Oxygen +2`, or `Housing = 0` for a value it sets (menu_terraforming.lua:1183-1197). */
	effect(effect: TerraformingEffectData): string {
		const name = this.catalog.statName(effect.stat);
		if (effect.change) {
			return `${name} ${NumberFormats.signedWhole(effect.change)}`;
		}
		return `${name} = ${NumberFormats.whole(effect.value ?? 0)}`;
	}

	/** Runs of whole values, e.g. `2–8` or `1–3, 9`. */
	static spans(values: readonly number[]): string {
		const runs: [number, number][] = [];
		for (const value of values) {
			const last = runs.at(-1);
			if (last && last[1] === value - 1) {
				last[1] = value;
			} else {
				runs.push([value, value]);
			}
		}
		return runs.map(([from, to]) => (from === to ? `${from}` : `${from}–${to}`)).join(', ') || '-';
	}
}
