import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StationCalculatorLink } from '../station-calculator-link';
import { StationSuggestionsStore } from '../station-suggestions-store';

/** The closed-loop station of the picked row: its modules, workforce, mined wares and resources in reach. */
@Component({
	selector: 'app-station-suggestions-chain',
	imports: [DecimalPipe, RouterLink],
	templateUrl: './station-suggestions-chain.component.html',
})
export class StationSuggestionsChainComponent {
	protected readonly store = inject(StationSuggestionsStore);
	protected readonly calculator = StationCalculatorLink.PATH;
	protected readonly missing = computed(() =>
		(this.store.chain()?.missing ?? []).map((x) => this.store.wareName(x)).join(', ')
	);
	protected readonly params = computed(() => StationCalculatorLink.params(this.store.chain()?.modules ?? []));
}
