import type { ParamMap, Params } from '@angular/router';
import type { QueryParamCodec } from '../core/router/query-param-sync';
import { QueryParams } from '../shared/services/query-params';
import type { ChainSettings } from './production-chain';

/**
 * The production chain settings in the URL: `dir=usedby`, `pm` the preferred method, `n` the root modules, `lv`
 * the used-by levels and `o` the methods picked per ware (`ware:method,ware:method`). Defaults are left out.
 */
export class ProductionChainQuery implements QueryParamCodec<ChainSettings> {
	static readonly DEFAULTS: Readonly<ChainSettings> = {
		direction: 'inputs',
		method: 'default',
		modules: 1,
		overrides: {},
		depth: 1,
	};
	static readonly MODULES = { min: 1, max: 999, integer: true };
	static readonly DEPTH = { min: 0, max: 20, integer: true };

	/** @param method true for a production method a chain can prefer */
	constructor(private readonly method: (id: string) => boolean) {}

	read(params: ParamMap): ChainSettings {
		const defaults = ProductionChainQuery.DEFAULTS;
		return {
			direction: params.get('dir') === 'usedby' ? 'usedBy' : 'inputs',
			method: QueryParams.known(params, 'pm', this.method, defaults.method),
			modules: QueryParams.number(params, 'n', ProductionChainQuery.MODULES, defaults.modules),
			overrides: ProductionChainQuery.parseOverrides(params.get('o')),
			depth: QueryParams.number(params, 'lv', ProductionChainQuery.DEPTH, defaults.depth),
		};
	}

	write(settings: ChainSettings): Params {
		const defaults = ProductionChainQuery.DEFAULTS;
		const usedBy = settings.direction === 'usedBy';
		const overrides = Object.entries(settings.overrides)
			.map(([ware, method]) => `${ware}:${method}`)
			.sort()
			.join(',');
		return {
			dir: usedBy ? 'usedby' : null,
			pm: QueryParams.unlessDefault(settings.method, defaults.method),
			n: usedBy ? null : QueryParams.unlessDefault(settings.modules, defaults.modules),
			o: overrides || null,
			lv: usedBy ? QueryParams.unlessDefault(settings.depth, defaults.depth) : null,
		};
	}

	/** The settings with numbers out of range back at their defaults (a field being typed in). */
	static clean(settings: ChainSettings): ChainSettings {
		return QueryParams.clean(
			settings,
			{ modules: ProductionChainQuery.MODULES, depth: ProductionChainQuery.DEPTH },
			ProductionChainQuery.DEFAULTS
		);
	}

	/** The `o` param as method by ware id; malformed parts are skipped. */
	static parseOverrides(value: string | null): Record<string, string> {
		const result: Record<string, string> = {};
		for (const part of (value ?? '').split(',')) {
			const [ware, method] = part.split(':');
			if (ware && method && /^\w+$/.test(ware) && /^\w+$/.test(method)) {
				result[ware] = method;
			}
		}
		return result;
	}
}
