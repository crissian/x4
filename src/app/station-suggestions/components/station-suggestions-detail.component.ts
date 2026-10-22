import { DecimalPipe, PercentPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketSettlement } from '../../economy/market-settlement';
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
	/** How far the existing supply travels before a new factory is scored. */
	protected readonly settlementJumps = MarketSettlement.MAX_JUMPS;
	protected readonly targets = computed(() =>
		(this.store.selected()?.targets ?? []).slice(0, StationSuggestionsDetailComponent.TARGETS)
	);
}
