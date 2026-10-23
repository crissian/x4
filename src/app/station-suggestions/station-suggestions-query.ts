import type { ParamMap, Params } from '@angular/router';
import type { PlacementLoop } from '../economy/placement-model';
import { NumberRange, QueryParams } from '../shared/services/query-params';

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
	/** the values each number accepts */
	static readonly RANGES = { jumps: { min: 1, max: 6, integer: true } } satisfies Record<string, NumberRange>;

	static read(params: ParamMap, lookups: StationSuggestionsLookups): StationSuggestionsModel {
		const defaults = StationSuggestionsQuery.DEFAULTS;
		return {
			mode: QueryParams.oneOf(params, 'mode', StationSuggestionsQuery.MODES, defaults.mode),
			loop: QueryParams.oneOf(params, 'loop', [StationSuggestionsQuery.OPEN], defaults.loop),
			ware: QueryParams.known(params, 'ware', lookups.ware, defaults.ware),
			sector: lookups.sectorName(params.get('sector') ?? '') ?? defaults.sector,
			jumps: QueryParams.number(params, 'jumps', StationSuggestionsQuery.RANGES.jumps, defaults.jumps),
			hideHostile: params.get('hostile') !== '1',
			player: params.get('player') !== '0',
			group: QueryParams.known(params, 'group', lookups.group, defaults.group),
		};
	}

	/** Every filter param, null for a default (so a merge removes it). */
	static write(model: StationSuggestionsModel, lookups: StationSuggestionsLookups): Params {
		const defaults = StationSuggestionsQuery.DEFAULTS;
		const here = model.mode === StationSuggestionsQuery.HERE;
		return {
			mode: here ? model.mode : null,
			loop: QueryParams.unlessDefault(model.loop, defaults.loop),
			ware: !here && model.ware ? model.ware : null,
			sector: here ? (lookups.sectorId(model.sector) ?? null) : null,
			jumps: QueryParams.unlessDefault(model.jumps, defaults.jumps),
			hostile: model.hideHostile ? null : '1',
			player: model.player ? null : '0',
			group: model.group || null,
		};
	}

	/** The model with jumps out of range or not a number back at the default. */
	static clean(model: StationSuggestionsModel): StationSuggestionsModel {
		return QueryParams.clean(model, StationSuggestionsQuery.RANGES, StationSuggestionsQuery.DEFAULTS);
	}
}
