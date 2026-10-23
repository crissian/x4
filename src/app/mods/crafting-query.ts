import type { ParamMap, Params } from '@angular/router';
import { QueryParams } from '../shared/services/query-params';

/** The pickers of the crafting page; empty for none. */
export interface CraftingModel {
	/** the mod or item to craft */
	craft: string;
	/** how many of it */
	times: number;
	/** an item the player has, to see what it crafts into */
	have: string;
}

/** Reads the crafting page's pickers from the URL query params and writes them back, defaults left out. */
export class CraftingQuery {
	static readonly DEFAULTS: Readonly<CraftingModel> = { craft: '', times: 1, have: '' };
	private static readonly TIMES = { min: 1, max: 999, integer: true };

	/** `known` tells the recipe and item ids apart from unknown ones. */
	static read(
		params: ParamMap,
		known: { recipe: (id: string) => boolean; item: (id: string) => boolean }
	): CraftingModel {
		return {
			craft: QueryParams.known(params, 'craft', known.recipe),
			times: QueryParams.number(params, 'times', CraftingQuery.TIMES, 1),
			have: QueryParams.known(params, 'have', known.item),
		};
	}

	/** Every param, null for a default (so a merge removes it). */
	static write(model: CraftingModel): Params {
		return {
			craft: model.craft || null,
			times: model.craft ? QueryParams.unlessDefault(CraftingQuery.times(model), 1) : null,
			have: model.have || null,
		};
	}

	/** The count to craft, 1 when the input holds no valid count. */
	static times(model: CraftingModel): number {
		return QueryParams.inRange(model.times, CraftingQuery.TIMES) ? model.times : 1;
	}
}
