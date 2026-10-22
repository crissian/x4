import { HeatColors } from './heat-colors';
import { OneSidedHeatColors } from './one-sided-heat-colors';

/** The colour scale of a heat map: diverging (red, grey, green) or positive (grey to green). */
export type HeatPaletteName = 'diverging' | 'positive';

/** How a heat map colours its values. */
export interface HeatPalette {
	/** The end of the scale for these values. */
	scale(values: Iterable<number>): number;
	/** The colour of a value on the scale of `max`. */
	fill(value: number, max: number): string;
	/** The legend swatches from the lowest to the highest step. */
	legend(): string[];
}

/** The palettes of the heat map by name. */
export class HeatPalettes {
	private static readonly palettes: Record<HeatPaletteName, HeatPalette> = {
		diverging: {
			scale: (values) => HeatColors.scale(values),
			fill: (value, max) => HeatColors.fill(value, max),
			legend: () => HeatColors.legend(),
		},
		positive: {
			scale: (values) => OneSidedHeatColors.scale(values),
			fill: (value, max) => OneSidedHeatColors.fill(value, max),
			legend: () => OneSidedHeatColors.legend(),
		},
	};

	static of(name: HeatPaletteName): HeatPalette {
		return HeatPalettes.palettes[name];
	}
}
