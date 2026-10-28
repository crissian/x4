import { EnumLabels } from '../../core/enum-labels';
import { Effects } from './data/effects-data';
import { Dock, Production as ProductionModel, ProductionEffect, Slot, SlotSummary, Ware } from './model/model';
import { WareService } from './ware.service';

export interface ProductionWareData {
	ware: Ware;
	amount: number;
}

export interface ProductionData {
	time: number;
	amount: number;
	method: string;
	name: string;
	wares: ProductionWareData[];
	efficiency?: ProductionEffect;
}

export type PriceKind = 'min' | 'avg' | 'max';

export class Production {
	static toProductionData(productions: ProductionModel[] | undefined, wareService: WareService): ProductionData[] {
		return (productions ?? []).map((x) => ({
			amount: x.amount,
			method: x.method,
			name: x.name,
			time: x.time,
			efficiency: x.effects?.find((y) => y.type == Effects.work),
			wares: x.wares.flatMap((y) => {
				const ware = wareService.getEntity(y.ware);
				return ware ? [{ ware, amount: y.amount }] : [];
			}),
		}));
	}

	static getProductionTotal(production: ProductionData, kind: PriceKind) {
		return production.wares.reduce((total, x) => total + x.amount * x.ware.price[kind], 0);
	}

	/** What a recipe's wares cost at the given prices, such as the build cost of a module; 0 without a recipe. */
	static cost(production: ProductionModel | undefined, price: (ware: string) => number): number {
		return production?.wares.reduce((total, x) => total + x.amount * price(x.ware), 0) ?? 0;
	}

	static getSlots(value: readonly (Slot | Dock)[] | undefined): SlotSummary[] {
		if (!value) {
			return [];
		}

		const capacities = value.reduce<Record<string, number>>((obj, slot) => {
			obj[slot.size] = (obj[slot.size] || 0) + ((slot as Dock).capacity || 1);
			return obj;
		}, {});

		return Object.keys(capacities).map((size) => ({ size, capacity: capacities[size] }));
	}

	static getSlotsStr(value: readonly (Slot | Dock)[] | undefined) {
		const slots = Production.getSlots(value);
		if (slots.length == 0) {
			return '-';
		}

		return slots.map((x) => `${x.capacity} x ${EnumLabels.label(x.size)}`).join(', ');
	}
}
