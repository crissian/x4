import { DecimalPipe, PercentPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StationSuggestionsStore } from '../station-suggestions-store';
import { StationSuggestionsChainComponent } from './station-suggestions-chain.component';

/** The picked suggestion: what it earns, its closed-loop station or inputs, and the sectors behind the demand. */
@Component({
	selector: 'app-station-suggestions-detail',
	imports: [DecimalPipe, PercentPipe, RouterLink, StationSuggestionsChainComponent],
	templateUrl: './station-suggestions-detail.component.html',
})
export class StationSuggestionsDetailComponent {
	/** Sectors listed at most. */
	static readonly TARGETS = 10;

	protected readonly store = inject(StationSuggestionsStore);
	protected readonly targets = computed(() =>
		(this.store.selected()?.targets ?? []).slice(0, StationSuggestionsDetailComponent.TARGETS)
	);
}
