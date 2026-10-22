import type { ParamMap, Params } from '@angular/router';
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
	/** the lowest value each number accepts */
	static readonly MIN = { cargo: 1, speed: 100, charge: 0, jumps: 0 };

	static read(params: ParamMap, lookups: TradeRouteLookups): TradeRoutesModel {
		const defaults = TradeRouteQuery.DEFAULTS;
		const ship = params.get('ship') ?? '';
		const custom = !lookups.ship(ship);
		const cargoType = params.get('cargoType') ?? '';
		const ware = params.get('ware') ?? '';
		return {
			ship: custom ? defaults.ship : ship,
			cargo: custom ? TradeRouteQuery.number(params, 'cargo') : defaults.cargo,
			cargoType: custom && TradeRouteQuery.CARGO_TYPES.includes(cargoType) ? cargoType : defaults.cargoType,
			speed: custom ? TradeRouteQuery.number(params, 'speed') : defaults.speed,
			charge: custom ? TradeRouteQuery.number(params, 'charge') : defaults.charge,
			near: lookups.sectorName(params.get('near') ?? '') ?? '',
			jumps: TradeRouteQuery.number(params, 'jumps'),
			ware: lookups.ware(ware) ? ware : '',
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
			keep && model[key] !== defaults[key] ? model[key] : null;
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
		const result = { ...model };
		for (const key of Object.keys(TradeRouteQuery.MIN) as (keyof typeof TradeRouteQuery.MIN)[]) {
			if (!TradeRouteQuery.valid(model[key], key)) {
				result[key] = TradeRouteQuery.DEFAULTS[key];
			}
		}
		return result;
	}

	private static valid(value: number, key: keyof typeof TradeRouteQuery.MIN): boolean {
		return Number.isFinite(value) && value >= TradeRouteQuery.MIN[key];
	}

	private static number(params: ParamMap, key: keyof typeof TradeRouteQuery.MIN): number {
		const raw = params.get(key);
		const value = raw ? Number(raw) : NaN;
		return TradeRouteQuery.valid(value, key) ? value : TradeRouteQuery.DEFAULTS[key];
	}
}
