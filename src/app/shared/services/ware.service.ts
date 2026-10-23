import { Injectable } from '@angular/core';
import { AllWares } from './data/wares-data';
import { EntityStore } from './entity.service';
import { Ware, WareGroup } from './model/model';

@Injectable({ providedIn: 'root' })
export class WareService extends EntityStore<Ware> {
	private static order: Record<string, number> = {
		gases: 0,
		ice: 10,
		minerals: 20,
		energy: 30,
		water: 40,
		refined: 50,
		agricultural: 60,
		food: 70,
		pharmaceutical: 80,
		hightech: 90,
		shiptech: 100,
	};

	constructor() {
		super(AllWares);
	}

	/** The worth of the wares at their average prices; a ware without a price counts nothing. */
	averageValue(wares: readonly { ware: string; amount: number }[]): number {
		return wares.reduce((sum, x) => sum + x.amount * (this.getEntity(x.ware)?.price.avg ?? 0), 0);
	}

	getWaresUsingWare(id: string): Ware[] {
		return this.getEntities().filter((x) => EntityStore.usesWare(x, id));
	}

	compareGroups(a: WareGroup, b: WareGroup) {
		const aidx = WareService.order[a.id];
		const bidx = WareService.order[b.id];

		if (aidx == bidx) {
			return this.compareProp(a, b, 'name');
		}

		return aidx - bidx;
	}

	compareWares(a: Ware, b: Ware) {
		const aidx = WareService.order[a.group?.id ?? ''];
		const bidx = WareService.order[b.group?.id ?? ''];

		if (aidx == bidx) {
			return this.compareProp(a, b, 'name');
		}

		return aidx - bidx;
	}

	private compareProp<T>(a: T, b: T, prop: keyof T) {
		if (a[prop] < b[prop]) {
			return -1;
		} else if (a[prop] > b[prop]) {
			return 1;
		}
		return 0;
	}
}
