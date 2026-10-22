import type { PlacementInput, PlacementResource, PlacementSpot, PlacementTarget } from '../economy/placement-model';

/** A table row: the suggested spot with the names it shows. */
export interface StationSuggestionRow extends PlacementSpot {
	/** `ware~sector`, the `pick` URL param */
	key: string;
	name: string;
	sectorName: string;
	/** ware group id */
	group: string;
	/** the top sectors behind the demand and their jumps, such as "Getsu Fune (1), Argon Prime (here)" */
	contributors: string;
}

/** The texts of the station suggestions rows. */
export class StationSuggestionTexts {
	/** Sectors named in the contributors column. */
	static readonly TOP = 2;
	private static readonly SEPARATOR = '~';

	static key(ware: string, sector: string): string {
		return `${ware}${StationSuggestionTexts.SEPARATOR}${sector}`;
	}

	/** The top sectors that pull: those short of the ware, the biggest weighted shortage first, with their jumps. */
	static contributors(targets: readonly PlacementTarget[], name: (sector: string) => string): string {
		return targets
			.filter((x) => x.pull > 0)
			.slice(0, StationSuggestionTexts.TOP)
			.map((x) => `${name(x.sector)} (${x.jumps ? x.jumps : $localize`:distance of a sector:here`})`)
			.join(', ');
	}

	/** The inputs chip: "inputs 2/3 in reach". */
	static inputs(inputs: readonly PlacementInput[]): string {
		const covered = inputs.filter((x) => x.covered).length;
		return inputs.length ? $localize`inputs ${covered}:covered:/${inputs.length}:total: in reach` : '';
	}

	/** The title of the inputs chip: each input and its weighted balance within reach. */
	static inputsTitle(
		inputs: readonly PlacementInput[],
		name: (ware: string) => string,
		perHour: (value: number) => string
	): string {
		return inputs
			.map((x) => {
				const state = x.covered ? '✓' : '✗';
				const balance = x.mined
					? x.covered
						? $localize`mined in reach`
						: $localize`no resource in reach`
					: perHour(x.balance ?? 0);
				return `${state} ${name(x.ware)}: ${balance}`;
			})
			.join('\n');
	}

	/** The resources chip: "resources 2/3 in reach". */
	static resources(resources: readonly PlacementResource[]): string {
		const found = resources.filter((x) => x.jumps !== undefined).length;
		return resources.length ? $localize`resources ${found}:found:/${resources.length}:total: in reach` : '';
	}

	/** The title of the resources chip: each mined ware and the jumps to its nearest field. */
	static resourcesTitle(resources: readonly PlacementResource[], name: (ware: string) => string): string {
		const lines = resources.map((x) =>
			x.jumps === undefined ? `✗ ${name(x.ware)}` : `✓ ${name(x.ware)} (${x.jumps})`
		);
		return lines.length ? [$localize`Mined by your ships; jumps to the nearest field:`, ...lines].join('\n') : '';
	}
}
