import { Effects } from './data/effects-data';
import { Dock, Production, ProductionEffect, Slot, SlotSummary, Ware } from './model/model';
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

export function toProductionData(productions: Production[], wareService: WareService): ProductionData[] {
	return (productions ?? []).map((x) => ({
		amount: x.amount,
		method: x.method,
		name: x.name,
		time: x.time,
		efficiency: x.effects?.find((y) => y.type == Effects.work) ?? null,
		wares: x.wares.map((y) => ({
			ware: wareService.getEntity(y.ware),
			amount: y.amount,
		})),
	}));
}

export function getProductionTotal(production: ProductionData, kind: PriceKind) {
	return production.wares.reduce((total, x) => total + x.amount * x.ware.price[kind], 0);
}

export function formatProductionTime(amount: number) {
	const minutes = Math.trunc(amount / 60);
	const seconds = amount - minutes * 60;

	let result = '';
	if (minutes > 0) {
		result += minutes + (minutes === 1 ? ' minute' : ' minutes');
	}
	if (seconds > 0) {
		if (minutes > 0) {
			result += ' ';
		}
		result += seconds + (seconds === 1 ? ' second' : ' seconds');
	}

	return result;
}

export function getSlots(value: (Slot | Dock)[]): SlotSummary[] {
	if (!value) {
		return [];
	}

	const capacities = value.reduce<Record<string, number>>((obj, slot) => {
		obj[slot.size] = (obj[slot.size] || 0) + ((slot as Dock).capacity || 1);
		return obj;
	}, {});

	return Object.keys(capacities).map((size) => ({ size, capacity: capacities[size] }));
}

export function getSlotsStr(value: (Slot | Dock)[]) {
	const slots = getSlots(value);
	if (slots.length == 0) {
		return '-';
	}

	return slots.map((x) => `${x.capacity} x ${x.size}`).join(', ');
}
