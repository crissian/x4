import { Component, computed, inject } from '@angular/core';
import { ProgressBarComponent } from '../../shared/components/progress-bar.component';
import { BlueprintCategories } from '../blueprint-categories';
import { BlueprintsStore } from '../blueprints-store';
import { BlueprintItemLinkComponent } from './blueprint-item-link.component';

/** Owned and total blueprints per category, a card per kind, each category listing what is missing. */
@Component({
	selector: 'app-blueprint-progress',
	imports: [BlueprintItemLinkComponent, ProgressBarComponent],
	templateUrl: './blueprint-progress.component.html',
})
export class BlueprintProgressComponent {
	protected readonly store = inject(BlueprintsStore);

	/** The filtered categories by kind, kinds without any left out. */
	protected readonly kinds = computed(() => {
		const categories = this.store.categories();
		return BlueprintCategories.KINDS.map((kind) => ({
			...kind,
			categories: categories.filter((x) => x.category.kind === kind.kind),
		})).filter((x) => x.categories.length > 0);
	});
}
