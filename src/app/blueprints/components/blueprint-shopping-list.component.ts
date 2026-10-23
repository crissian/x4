import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { FactionLabelComponent } from '../../shared/components/faction-label.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import type { ShoppingSection } from '../blueprint-query';
import { BlueprintsStore } from '../blueprints-store';
import { BlueprintItemLinkComponent } from './blueprint-item-link.component';
import { BlueprintShoppingColumns } from './blueprint-shopping-columns';

/** The missing blueprints, a sub-tab each: what to buy now, what needs more reputation and what no faction sells. */
@Component({
	selector: 'app-blueprint-shopping-list',
	imports: [BlueprintItemLinkComponent, DataGridComponent, DecimalPipe, FactionLabelComponent, TabsComponent],
	templateUrl: './blueprint-shopping-list.component.html',
})
export class BlueprintShoppingListComponent {
	protected readonly store = inject(BlueprintsStore);
	protected readonly columns = new BlueprintShoppingColumns();
	protected readonly trackBy = (row: { item: { id: string } }) => row.item.id;

	protected readonly sections = computed<TabItem<ShoppingSection>[]>(() => {
		const list = this.store.filtered();
		return [
			{ id: 'buy', label: $localize`:shopping list tab:Buy now`, count: list.buy.length },
			{
				id: 'reputation',
				label: $localize`:shopping list tab:Need more reputation`,
				count: list.reputation.length,
			},
			{ id: 'unsold', label: $localize`:shopping list tab:Not sold anywhere`, count: list.unsold.length },
		];
	});
}
