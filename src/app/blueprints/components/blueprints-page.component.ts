import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExperimentalBadgeComponent } from '../../shared/components/experimental-badge.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import type { BlueprintTab } from '../blueprint-query';
import { BlueprintsStore } from '../blueprints-store';
import { BlueprintFiltersComponent } from './blueprint-filters.component';
import { BlueprintProgressComponent } from './blueprint-progress.component';
import { BlueprintShoppingListComponent } from './blueprint-shopping-list.component';

/** The player's blueprints from the active save: progress per category and what to buy next. */
@Component({
	imports: [
		BlueprintFiltersComponent,
		BlueprintProgressComponent,
		BlueprintShoppingListComponent,
		ExperimentalBadgeComponent,
		RouterLink,
		TabsComponent,
	],
	templateUrl: './blueprints-page.component.html',
	providers: [BlueprintsStore],
})
export default class BlueprintsPageComponent {
	protected readonly store = inject(BlueprintsStore);

	protected readonly tabs = computed<TabItem<BlueprintTab>[]>(() => {
		const progress = this.store.progress();
		return [
			{ id: 'progress', label: $localize`:blueprints tab:Progress` },
			{ id: 'shopping', label: $localize`:blueprints tab:Shopping list`, count: progress.total - progress.owned },
		];
	});
}
