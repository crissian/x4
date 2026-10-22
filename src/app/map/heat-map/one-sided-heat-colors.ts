import { HeatColors } from './heat-colors';

/**
 * Colours of a heat map of values that are never negative: grey at zero, then eight greens from dim to strong in
 * equal steps of the square root of the value relative to the scale's end (the 95th percentile, as `HeatColors`).
 */
export class OneSidedHeatColors {
	/** Steps above zero. */
	static readonly STEPS = 8;
	private static readonly ZERO = 'hsl(215, 14%, 30%)';

	/** The end of the scale, the 95th percentile of the values. */
	static scale(values: Iterable<number>): number {
		return HeatColors.scale(values);
	}

	/** The step of a value, 0 for zero or less, else 1 to 8. */
	static step(value: number, max: number): number {
		if (!(value > 0)) {
			return 0;
		}
		const share = Math.sqrt(Math.min(1, value / max));
		return Math.max(1, Math.ceil(share * OneSidedHeatColors.STEPS));
	}

	/** The colour of a value on the scale of `max`. */
	static fill(value: number, max: number): string {
		return OneSidedHeatColors.colour(OneSidedHeatColors.step(value, max));
	}

	/** The colour of a step: grey, then greens growing more saturated and lighter. */
	static colour(step: number): string {
		if (!step) {
			return OneSidedHeatColors.ZERO;
		}
		const share = (step - 1) / (OneSidedHeatColors.STEPS - 1);
		return `hsl(140, ${Math.round(22 + share * 50)}%, ${Math.round(24 + share * 24)}%)`;
	}

	/** The legend swatches from zero to the strongest step. */
	static legend(): string[] {
		return Array.from({ length: OneSidedHeatColors.STEPS + 1 }, (_, i) => OneSidedHeatColors.colour(i));
	}
}
