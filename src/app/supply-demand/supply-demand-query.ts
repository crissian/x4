import type { ParamMap, Params } from '@angular/router';
import { EconomyScopes } from '../economy/economy-scope';

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
		map: 'local',
	};
	/** the lowest value each number accepts */
	static readonly MIN = { jumps: 0 };

	static read(params: ParamMap, lookups: SupplyDemandLookups): SupplyDemandModel {
		const defaults = SupplyDemandQuery.DEFAULTS;
		const scope = params.get('scope') ?? '';
		const faction = params.get('faction') ?? '';
		const group = params.get('group') ?? '';
		return {
			scope: SupplyDemandQuery.SCOPES.includes(scope) ? scope : defaults.scope,
			faction: lookups.faction(faction) ? faction : defaults.faction,
			sector: lookups.sectorName(params.get('sector') ?? '') ?? defaults.sector,
			jumps: SupplyDemandQuery.jumps(params.get('jumps')),
			group: lookups.group(group) ? group : defaults.group,
			player: params.get('player') !== '0',
			mined: params.get('mined') === '1',
			map: SupplyDemandQuery.MAP_MODES.includes(params.get('map') ?? '') ? params.get('map')! : defaults.map,
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
			map: model.map === defaults.map ? null : model.map,
		};
	}

	/** The model with a jumps number that is below the minimum or not a whole number back at its default. */
	static clean(model: SupplyDemandModel): SupplyDemandModel {
		return SupplyDemandQuery.validJumps(model.jumps)
			? model
			: { ...model, jumps: SupplyDemandQuery.DEFAULTS.jumps };
	}

	private static validJumps(value: number): boolean {
		return Number.isInteger(value) && value >= SupplyDemandQuery.MIN.jumps;
	}

	private static jumps(raw: string | null): number {
		const value = raw ? Number(raw) : NaN;
		return SupplyDemandQuery.validJumps(value) ? value : SupplyDemandQuery.DEFAULTS.jumps;
	}
}
