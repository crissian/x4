import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { AchievementRows } from '../achievement-rows';
import { AchievementsStore } from '../achievements-store';
import { AchievementFiltersComponent } from './achievement-filters.component';

/**
 * The achievements the game scripts unlock, by DLC, with a done checkbox per achievement kept in this browser.
 * Story achievements hide their script notes until spoilers are shown.
 */
@Component({
	imports: [FormField, AchievementFiltersComponent],
	templateUrl: './achievements-page.component.html',
	providers: [AchievementsStore],
})
export default class AchievementsPageComponent {
	protected readonly store = inject(AchievementsStore);
	protected readonly categoryLabel = AchievementRows.categoryLabel;
}
