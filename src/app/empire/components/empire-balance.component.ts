import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import type { EmpireBalanceRow } from '../empire-balance';
import { EmpireStore } from '../empire-store';
import { EmpireColumns } from './empire-columns';
import { StationCalculatorLinkComponent } from './station-calculator-link.component';

/**
 * What the player's stations make and use per hour, together or one of them, with the station calculator's
 * production model: the largest shortage first.
 */
@Component({
	selector: 'app-empire-balance',
	imports: [DataGridComponent, RouterLink, StationCalculatorLinkComponent],
	templateUrl: './empire-balance.component.html',
})
export class EmpireBalanceComponent {
	protected readonly store = inject(EmpireStore);
	protected readonly columns = EmpireColumns.balance();
	protected readonly sort = EmpireColumns.BALANCE_SORT;
	protected readonly trackBy = (row: EmpireBalanceRow) => row.id;

	/** The one station chosen, for its calculator link. */
	protected readonly station = computed(() => {
		const stations = this.store.balanceStations();
		return this.store.model().station && stations.length === 1 ? stations[0] : undefined;
	});
	/** Stations counted whose built modules the site doesn't all know, or with modules still being built. */
	protected readonly incomplete = computed(() =>
		this.store.balanceStations().filter((x) => x.layout!.unknown.length || x.layout!.building)
	);
	protected readonly shortages = computed(() => this.store.balance().filter((x) => x.net < 0).length);
}
