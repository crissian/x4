import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StationLayoutLink } from '../../station/station-layout-link';
import { StationSuggestionsStore } from '../station-suggestions-store';
import { JumpsPipe } from '../../core/format/jumps.pipe';

/** The closed-loop station of the picked row: its modules, workforce, mined wares, miners and resources in reach. */
@Component({
	selector: 'app-station-suggestions-chain',
	imports: [JumpsPipe, DecimalPipe, RouterLink],
	templateUrl: './station-suggestions-chain.component.html',
})
export class StationSuggestionsChainComponent {
	protected readonly store = inject(StationSuggestionsStore);
	protected readonly calculator = StationLayoutLink.PATH;
	protected readonly missing = computed(() =>
		(this.store.chain()?.missing ?? []).map((x) => this.store.wareName(x)).join(', ')
	);
	/** Miners to buy: the fractional need rounded up. */
	protected count(value: number): number {
		return Math.ceil(value);
	}
	protected readonly params = computed(() =>
		StationLayoutLink.params(this.store.chain()?.modules ?? [], this.store.chainSunlight() * 100)
	);
}
