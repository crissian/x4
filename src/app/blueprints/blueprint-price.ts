import type { Price } from '../shared/services/model/model';
import type { BlueprintKind } from './blueprint-model';

/**
 * The price a faction representative asks for a blueprint (the game's blueprint trader menu): the maximum ware price
 * for modules, ten times the average for ships and equipment. It doesn't depend on the faction or the reputation.
 */
export class BlueprintPrice {
	static readonly FACTOR = 10;

	static of(price: Price | undefined, kind: BlueprintKind): number {
		if (!price) {
			return 0;
		}
		return kind === 'module' ? price.max : price.avg * BlueprintPrice.FACTOR;
	}
}
