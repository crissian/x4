import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MoreFiltersComponent } from '../../shared/components/more-filters.component';
import { GameStartsStore } from '../game-starts-store';

/** The type, search, view and owned DLC filters of the game starts page. */
@Component({
	selector: 'app-game-start-filters',
	imports: [FormField, MoreFiltersComponent],
	templateUrl: './game-start-filters.component.html',
})
export class GameStartFiltersComponent {
	protected readonly store = inject(GameStartsStore);
	protected readonly form = this.store.form;
}
