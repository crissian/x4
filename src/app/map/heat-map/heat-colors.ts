/**
 * Colours of a heat map on a diverging scale: a neutral grey at exactly zero, four reds below and four greens
 * above, from dim to strong, in equal steps of the square root of the value relative to the scale's end. A darker grey marks sectors
 * where nothing happens. The fills are dark enough for the dark map.
 */
export class HeatColors {
	/** Steps on each side of zero. */
	static readonly STEPS = 4;
	/** Sectors without any activity, darker than the neutral grey. */
	static readonly IDLE = 'hsl(215, 12%, 17%)';
	private static readonly ZERO = 'hsl(215, 14%, 38%)';
	private static readonly LOW = ['hsl(0, 35%, 30%)', 'hsl(0, 52%, 38%)', 'hsl(0, 66%, 46%)', 'hsl(0, 80%, 55%)'];
	private static readonly HIGH = [
		'hsl(140, 30%, 28%)',
		'hsl(140, 45%, 34%)',
		'hsl(140, 60%, 40%)',
		'hsl(140, 70%, 46%)',
	];

	/** The share of the absolute values the scale covers; the larger ones get the strongest colour. */
	static readonly PERCENTILE = 0.95;

	/**
	 * The end of the scale: the 95th percentile of the absolute values, so a few huge sectors don't wash out the
	 * rest. 1 when there are no values or they are all zero.
	 */
	static scale(values: Iterable<number>): number {
		const sorted = [...values].map((x) => Math.abs(x)).sort((a, b) => a - b);
		const cap = sorted[Math.max(0, Math.ceil(sorted.length * HeatColors.PERCENTILE) - 1)];
		return cap || 1;
	}

	/** The step of a value, from -4 (most negative) to 4 (most positive); 0 only for exactly zero. */
	static step(value: number, max: number): number {
		if (!value) {
			return 0;
		}
		const share = Math.sqrt(Math.min(1, Math.abs(value) / max));
		return Math.sign(value) * Math.max(1, Math.ceil(share * HeatColors.STEPS));
	}

	/** The colour of a value on the scale of `max`. */
	static fill(value: number, max: number): string {
		return HeatColors.colour(HeatColors.step(value, max));
	}

	/** The colour of a step. */
	static colour(step: number): string {
		if (!step) {
			return HeatColors.ZERO;
		}
		return (step < 0 ? HeatColors.LOW : HeatColors.HIGH)[Math.abs(step) - 1];
	}

	/** The legend swatches from the most negative to the most positive step. */
	static legend(): string[] {
		const steps = HeatColors.STEPS;
		return Array.from({ length: steps * 2 + 1 }, (_, i) => HeatColors.colour(i - steps));
	}
}
