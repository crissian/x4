import type { ParamMap, Params } from '@angular/router';
import { NumberRange, QueryParams } from '../shared/services/query-params';
import { TradeShips } from './trade-ships';

/** The filter form of the trade routes page. */
export interface TradeRoutesModel {
	/** a ship id or `custom` */
	ship: string;
	/** custom ship: m³ of `cargoType` */
	cargo: number;
	cargoType: string;
	speed: number;
	charge: number;
	/** sector name, picked from a datalist */
	near: string;
	jumps: number;
	/** ware id; empty for all */
	ware: string;
	hideHostile: boolean;
	playerOnly: boolean;
	/** `show` marks the illegal routes, `hide` leaves them out */
	illegal: string;
}

/** What the URL values are checked against. */
export interface TradeRouteLookups {
	ship(id: string): boolean;
	/** the name of a sector id, undefined when unknown */
	sectorName(id: string): string | undefined;
	/** the id of a sector name, undefined when unknown */
	sectorId(name: string): string | undefined;
	ware(id: string): boolean;
}

/** Reads the trade routes filters from the URL query params and writes them back, leaving the defaults out. */
export class TradeRouteQuery {
	static readonly CUSTOM = 'custom';
	static readonly CARGO_TYPES = ['container', 'solid', 'liquid', 'condensate'];
	static readonly DEFAULTS: Readonly<TradeRoutesModel> = {
		ship: TradeRouteQuery.CUSTOM,
		cargo: TradeShips.CUSTOM.capacity['container'],
		cargoType: 'container',
		speed: TradeShips.CUSTOM.speed,
		charge: TradeShips.CUSTOM.charge,
		near: '',
		jumps: 3,
		ware: '',
		hideHostile: true,
		playerOnly: true,
		illegal: 'show',
	};
	/** the values each number accepts */
	static readonly RANGES = {
		cargo: { min: 1 },
		speed: { min: 100 },
		charge: { min: 0 },
		jumps: { min: 0 },
	} satisfies Record<string, NumberRange>;

	static read(params: ParamMap, lookups: TradeRouteLookups): TradeRoutesModel {
		const defaults = TradeRouteQuery.DEFAULTS;
		const ship = QueryParams.known(params, 'ship', lookups.ship, defaults.ship);
		const custom = ship === defaults.ship;
		const number = (key: keyof typeof TradeRouteQuery.RANGES) =>
			QueryParams.number(params, key, TradeRouteQuery.RANGES[key], defaults[key]);
		return {
			ship,
			cargo: custom ? number('cargo') : defaults.cargo,
			cargoType: custom
				? QueryParams.oneOf(params, 'cargoType', TradeRouteQuery.CARGO_TYPES, defaults.cargoType)
				: defaults.cargoType,
			speed: custom ? number('speed') : defaults.speed,
			charge: custom ? number('charge') : defaults.charge,
			near: lookups.sectorName(params.get('near') ?? '') ?? '',
			jumps: number('jumps'),
			ware: QueryParams.known(params, 'ware', lookups.ware),
			hideHostile: params.get('hostile') !== '1',
			playerOnly: params.get('shady') !== '0',
			illegal: params.get('illegal') === 'hide' ? 'hide' : defaults.illegal,
		};
	}

	/** Every filter param, null for a default (so a merge removes it). */
	static write(model: TradeRoutesModel, lookups: TradeRouteLookups): Params {
		const defaults = TradeRouteQuery.DEFAULTS;
		const custom = model.ship === TradeRouteQuery.CUSTOM;
		const value = <K extends keyof TradeRoutesModel>(key: K, keep = true) =>
			keep ? QueryParams.unlessDefault(model[key], defaults[key]) : null;
		const near = lookups.sectorId(model.near);
		return {
			ship: value('ship'),
			cargo: value('cargo', custom),
			cargoType: value('cargoType', custom),
			speed: value('speed', custom),
			charge: value('charge', custom),
			near: near ?? null,
			jumps: value('jumps', !!near),
			ware: value('ware'),
			hostile: model.hideHostile ? null : '1',
			shady: model.playerOnly ? null : '0',
			illegal: value('illegal'),
		};
	}

	/** The model with the numbers below their minimum (or not numbers) back at their defaults. */
	static clean(model: TradeRoutesModel): TradeRoutesModel {
		return QueryParams.clean(model, TradeRouteQuery.RANGES, TradeRouteQuery.DEFAULTS);
	}
}
