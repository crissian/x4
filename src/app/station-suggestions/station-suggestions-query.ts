import type { ParamMap, Params } from '@angular/router';
import type { PlacementLoop } from '../economy/placement-model';

/** The filter form of the station suggestions page. */
export interface StationSuggestionsModel {
	/** `where`: galaxy-wide spots; `here`: the wares for one sector */
	mode: string;
	/** `closed`: the station makes its own chain; `open`: it buys its inputs */
	loop: PlacementLoop;
	/** ware id to look for, where to build only; empty for all */
	ware: string;
	/** sector name, picked from a datalist, what to build here only */
	sector: string;
	/** jumps a new factory sells within */
	jumps: number;
	/** leave out sectors owned by factions hostile to the player */
	hideHostile: boolean;
	/** player-owned stations count */
	player: boolean;
	/** ware group id; empty for all */
	group: string;
}

/** What the URL values are checked against. */
export interface StationSuggestionsLookups {
	ware(id: string): boolean;
	group(id: string): boolean;
	/** the name of a sector id, undefined when unknown */
	sectorName(id: string): string | undefined;
	/** the id of a sector name, undefined when unknown */
	sectorId(name: string): string | undefined;
}

/** Reads the station suggestions filters from the URL query params and writes them back, leaving the defaults out. */
export class StationSuggestionsQuery {
	static readonly WHERE = 'where';
	static readonly HERE = 'here';
	static readonly MODES = [StationSuggestionsQuery.WHERE, StationSuggestionsQuery.HERE];
	static readonly CLOSED: PlacementLoop = 'closed';
	static readonly OPEN: PlacementLoop = 'open';
	static readonly DEFAULTS: Readonly<StationSuggestionsModel> = {
		mode: StationSuggestionsQuery.WHERE,
		loop: StationSuggestionsQuery.CLOSED,
		ware: '',
		sector: '',
		jumps: 3,
		hideHostile: true,
		player: true,
		group: '',
	};
	/** the range of the jumps */
	static readonly JUMPS = { min: 1, max: 6 };

	static read(params: ParamMap, lookups: StationSuggestionsLookups): StationSuggestionsModel {
		const defaults = StationSuggestionsQuery.DEFAULTS;
		const mode = params.get('mode') ?? '';
		const ware = params.get('ware') ?? '';
		const group = params.get('group') ?? '';
		return {
			mode: StationSuggestionsQuery.MODES.includes(mode) ? mode : defaults.mode,
			loop: params.get('loop') === StationSuggestionsQuery.OPEN ? StationSuggestionsQuery.OPEN : defaults.loop,
			ware: lookups.ware(ware) ? ware : defaults.ware,
			sector: lookups.sectorName(params.get('sector') ?? '') ?? defaults.sector,
			jumps: StationSuggestionsQuery.jumps(params.get('jumps')),
			hideHostile: params.get('hostile') !== '1',
			player: params.get('player') !== '0',
			group: lookups.group(group) ? group : defaults.group,
		};
	}

	/** Every filter param, null for a default (so a merge removes it). */
	static write(model: StationSuggestionsModel, lookups: StationSuggestionsLookups): Params {
		const defaults = StationSuggestionsQuery.DEFAULTS;
		const here = model.mode === StationSuggestionsQuery.HERE;
		return {
			mode: here ? model.mode : null,
			loop: model.loop === defaults.loop ? null : model.loop,
			ware: !here && model.ware ? model.ware : null,
			sector: here ? (lookups.sectorId(model.sector) ?? null) : null,
			jumps: model.jumps === defaults.jumps ? null : model.jumps,
			hostile: model.hideHostile ? null : '1',
			player: model.player ? null : '0',
			group: model.group || null,
		};
	}

	/** The model with jumps out of range or not a number back at the default. */
	static clean(model: StationSuggestionsModel): StationSuggestionsModel {
		return StationSuggestionsQuery.validJumps(model.jumps)
			? model
			: { ...model, jumps: StationSuggestionsQuery.DEFAULTS.jumps };
	}

	private static validJumps(value: number): boolean {
		const { min, max } = StationSuggestionsQuery.JUMPS;
		return Number.isInteger(value) && value >= min && value <= max;
	}

	private static jumps(raw: string | null): number {
		const value = raw ? Number(raw) : NaN;
		return StationSuggestionsQuery.validJumps(value) ? value : StationSuggestionsQuery.DEFAULTS.jumps;
	}
}
