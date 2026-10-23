import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { entityImage } from '../../shared/services/data/images-data';
import type { Ware } from '../../shared/services/model/model';
import { WareService } from '../../shared/services/ware.service';
import { ProductionChainComponent } from './production-chain.component';

/** Wares of one ware group, for the picker. */
interface WareGroupItems {
	name: string;
	wares: { ware: Ware; icon: string | null }[];
}

/**
 * The production chains page: a searchable list of the wares, and the chain of the one named by the `:id` route
 * param.
 */
@Component({
	imports: [FormField, RouterLink, ProductionChainComponent],
	templateUrl: './production-chain-page.component.html',
})
export class ProductionChainPageComponent {
	/** ware id route param; none for the picker alone */
	readonly id = input<string>();

	private readonly wares = inject(WareService);
	protected readonly ware = computed(() => this.wares.getEntity(this.id() ?? ''));
	protected readonly icon = computed(() => entityImage('wares', this.ware()?.id));

	/** the search text, cleared when another ware is picked */
	private readonly search = linkedSignal({ source: this.id, computation: () => ({ text: '' }) });
	protected readonly searchForm = form(this.search);
	/** the list is folded away under a picked ware until a search is typed */
	protected readonly listShown = computed(() => !this.ware() || !!this.search().text.trim());

	protected readonly groups = computed<WareGroupItems[]>(() => {
		const text = this.search().text.trim().toLowerCase();
		const groups: WareGroupItems[] = [];
		const sorted = [...this.wares.getEntities()].sort((a, b) => this.wares.compareWares(a, b));
		for (const ware of sorted) {
			if (text && !ware.name.toLowerCase().includes(text)) {
				continue;
			}
			const name = ware.group?.name ?? '';
			let group = groups.find((x) => x.name === name);
			if (!group) {
				group = { name, wares: [] };
				groups.push(group);
			}
			group.wares.push({ ware, icon: entityImage('wares', ware.id) });
		}
		return groups;
	});
}
