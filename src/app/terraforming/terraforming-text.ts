import { NumberFormats } from '../core/format/number-formats';
import type { Tone } from '../shared/components/tone-dot/tone-dot.component';
import type {
	TerraformingConditionData,
	TerraformingEffectData,
	TerraformingStatData,
} from '../shared/services/data/terraforming-data';
import type { TerraformingCatalog } from './terraforming-catalog';
import type { TerraformingProjectState } from './terraforming-planet-state';

/** Display texts of terraforming conditions, effects and project states. */
export class TerraformingText {
	static readonly TONES: Record<TerraformingProjectState, Tone> = {
		completed: 'green',
		ready: 'teal',
		waiting: 'grey',
		unknown: 'amber',
	};
	static readonly STATES: readonly TerraformingProjectState[] = ['ready', 'unknown', 'waiting', 'completed'];

	private static states?: Record<TerraformingProjectState, string>;

	constructor(private readonly catalog: TerraformingCatalog) {}

	static state(state: TerraformingProjectState): string {
		TerraformingText.states ??= {
			completed: $localize`:terraforming project state:Completed`,
			ready: $localize`:terraforming project state:Requirements met`,
			waiting: $localize`:terraforming project state:Requirements not met`,
			unknown: $localize`:terraforming project state:Can't tell`,
		};
		return TerraformingText.states[state];
	}

	/** e.g. `Temperature 2–5` for range states, `Housing ≥ 10,000` for values. */
	condition(condition: TerraformingConditionData): string {
		const name = this.catalog.statName(condition.stat);
		const parts: string[] = [];
		if (condition.min !== undefined || condition.max !== undefined) {
			const stat = this.catalog.stat(condition.stat);
			parts.push(stat ? this.valueSpans(stat, condition.min, condition.max) : '?');
		}
		if (condition.minValue !== undefined) {
			parts.push(`≥ ${NumberFormats.whole(condition.minValue)}`);
		}
		if (condition.maxValue !== undefined) {
			parts.push(`≤ ${NumberFormats.whole(condition.maxValue)}`);
		}
		return `${name} ${parts.join(' ')}`.trim();
	}

	/** e.g. `Oxygen +2`, `Housing = 0`, with the library's min/max after it. */
	effect(effect: TerraformingEffectData): string {
		const parts = [this.catalog.statName(effect.stat)];
		if (effect.change !== undefined) {
			parts.push(NumberFormats.signedWhole(effect.change));
		}
		if (effect.value !== undefined) {
			parts.push(`= ${NumberFormats.whole(effect.value)}`);
		}
		const bounds = [
			effect.min !== undefined
				? $localize`:terraforming effect bound:min ${NumberFormats.whole(effect.min)}:value:`
				: '',
			effect.max !== undefined
				? $localize`:terraforming effect bound:max ${NumberFormats.whole(effect.max)}:value:`
				: '',
		].filter((x) => x);
		if (bounds.length) {
			parts.push(`(${bounds.join(', ')})`);
		}
		return parts.join(' ');
	}

	/** The runs of whole values whose range state is within min..max, e.g. `2–8` or `0–3, 9`. */
	valueSpans(stat: TerraformingStatData, min?: number, max?: number): string {
		const allowed = this.catalog
			.scale(stat)
			.filter((x) => (min === undefined || x.range.state >= min) && (max === undefined || x.range.state <= max))
			.map((x) => x.value);
		const runs: [number, number][] = [];
		for (const value of allowed) {
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
