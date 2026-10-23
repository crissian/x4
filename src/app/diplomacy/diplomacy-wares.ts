import { Injectable, inject } from '@angular/core';
import type { WareAmountTarget } from '../shared/components/ware-amounts/ware-amounts.component';
import { DiplomacyService } from '../shared/services/diplomacy.service';
import { CraftingItemService } from '../shared/services/equipment-mod.service';

/** The inventory wares of diplomacy: their names, linked to their crafting item page when there is one. */
@Injectable({ providedIn: 'root' })
export class DiplomacyWares {
	private readonly service = inject(DiplomacyService);
	private readonly items = inject(CraftingItemService);

	/** For `app-ware-amounts`. */
	readonly resolve = (ware: string): WareAmountTarget => ({ name: this.service.ware(ware), link: this.link(ware) });

	link(ware: string): readonly unknown[] | undefined {
		return this.items.getEntity(ware) ? ['/mods/items', ware] : undefined;
	}

	/** The wares with their names and links, by name. */
	list(wares: readonly string[]): WareAmountTarget[] {
		return wares.map((x) => this.resolve(x)).sort((a, b) => a.name.localeCompare(b.name));
	}
}
