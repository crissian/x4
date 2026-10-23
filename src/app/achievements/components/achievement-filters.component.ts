import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { AchievementsStore } from '../achievements-store';

/** The search, category, DLC, done and spoiler filters of the achievements page. */
@Component({
	selector: 'app-achievement-filters',
	imports: [FormField],
	templateUrl: './achievement-filters.component.html',
})
export class AchievementFiltersComponent {
	protected readonly store = inject(AchievementsStore);
	protected readonly form = this.store.form;
}
