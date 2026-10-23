import type { ParamMap, Params } from '@angular/router';
import { EconomyScopes } from '../economy/economy-scope';
import { NumberRange, QueryParams } from '../shared/services/query-params';

/** The filter form of the supply and demand page. */
export interface SupplyDemandModel {
	/** `galaxy`, `faction` or `sector` */
	scope: string;
	/** faction id, for the faction scope */
	faction: string;
	/** sector name, picked from a datalist, for the sector scope */
	sector: string;
	/** jumps around the sector */
	jumps: number;
	/** ware group id; empty for all */
	group: string;
	/** player-owned stations count */
	player: boolean;
	/** mined wares are listed */
	mined: boolean;
	/** the offers of stations owned by factions hostile to the player are left out */
	hideHostile: boolean;
	/** `local`: each sector by its own stations; `reach`: by the stations within the jumps around it */
	map: string;
}

/** What the URL values are checked against. */
export interface SupplyDemandLookups {
	faction(id: string): boolean;
	group(id: string): boolean;
	/** the name of a sector id, undefined when unknown */
	sectorName(id: string): string | undefined;
	/** the id of a sector name, undefined when unknown */
	sectorId(name: string): string | undefined;
}

/** Reads the supply and demand filters from the URL query params and writes them back, leaving the defaults out. */
export class SupplyDemandQuery {
	static readonly SCOPES = ['galaxy', 'faction', 'sector'];
	static readonly MAP_MODES = ['local', 'reach'];
	static readonly DEFAULTS: Readonly<SupplyDemandModel> = {
		scope: 'galaxy',
		faction: '',
		sector: '',
		jumps: EconomyScopes.DEFAULT_JUMPS,
		group: '',
		player: true,
		mined: false,
		hideHostile: true,
		map: 'local',
	};
	/** the values each number accepts */
	static readonly RANGES = { jumps: { min: 0, integer: true } } satisfies Record<string, NumberRange>;

	static read(params: ParamMap, lookups: SupplyDemandLookups): SupplyDemandModel {
		const defaults = SupplyDemandQuery.DEFAULTS;
		return {
			scope: QueryParams.oneOf(params, 'scope', SupplyDemandQuery.SCOPES, defaults.scope),
			faction: QueryParams.known(params, 'faction', lookups.faction, defaults.faction),
			sector: lookups.sectorName(params.get('sector') ?? '') ?? defaults.sector,
			jumps: QueryParams.number(params, 'jumps', SupplyDemandQuery.RANGES.jumps, defaults.jumps),
			group: QueryParams.known(params, 'group', lookups.group, defaults.group),
			player: params.get('player') !== '0',
			mined: params.get('mined') === '1',
			hideHostile: params.get('hostile') !== '1',
			map: QueryParams.oneOf(params, 'map', SupplyDemandQuery.MAP_MODES, defaults.map),
		};
	}

	/** Every filter param, null for a default (so a merge removes it). */
	static write(model: SupplyDemandModel, lookups: SupplyDemandLookups): Params {
		const defaults = SupplyDemandQuery.DEFAULTS;
		const sector = lookups.sectorId(model.sector);
		const faction = model.scope === 'faction' && model.faction ? model.faction : null;
		const near = model.scope === 'sector' && sector ? sector : null;
		return {
			scope: faction || near ? model.scope : null,
			faction,
			sector: near,
			jumps: (near || model.map === 'reach') && model.jumps !== defaults.jumps ? model.jumps : null,
			group: model.group || null,
			player: model.player ? null : '0',
			mined: model.mined ? '1' : null,
			hostile: model.hideHostile ? null : '1',
			map: QueryParams.unlessDefault(model.map, defaults.map),
		};
	}

	/** How many of the filters under "More filters" (my stations, mined resources, hostile factions) are not at their default. */
	static moreFiltersSet(model: SupplyDemandModel): number {
		const defaults = SupplyDemandQuery.DEFAULTS;
		return (
			Number(model.player !== defaults.player) +
			Number(model.mined !== defaults.mined) +
			Number(model.hideHostile !== defaults.hideHostile)
		);
	}

	/** The model with a jumps number that is below the minimum or not a whole number back at its default. */
	static clean(model: SupplyDemandModel): SupplyDemandModel {
		return QueryParams.clean(model, SupplyDemandQuery.RANGES, SupplyDemandQuery.DEFAULTS);
	}
}
