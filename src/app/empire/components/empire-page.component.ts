import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMap } from '@lucide/angular';
import { EnumLabels } from '../../core/enum-labels';
import { NumberFormats } from '../../core/format/number-formats';
import { SavePageComponent } from '../../shared/components/save-page/save-page.component';
import { StatTileComponent } from '../../shared/components/stat-tile.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import type { EmpireTab } from '../empire-query';
import { EmpireStore } from '../empire-store';
import { EmpireBalanceComponent } from './empire-balance.component';
import { EmpireFiltersComponent } from './empire-filters.component';
import { EmpireShipsComponent } from './empire-ships.component';
import { EmpireStationsComponent } from './empire-stations.component';

/** Everything the player owns in the active save: summary tiles, then their ships and stations in tabs. */
@Component({
	imports: [
		EmpireBalanceComponent,
		EmpireFiltersComponent,
		EmpireShipsComponent,
		EmpireStationsComponent,
		LucideMap,
		RouterLink,
		SavePageComponent,
		StatTileComponent,
		TabsComponent,
	],
	templateUrl: './empire-page.component.html',
	providers: [EmpireStore],
})
export default class EmpirePageComponent {
	protected readonly store = inject(EmpireStore);
	protected readonly whole = NumberFormats.whole;

	protected readonly tabs = computed<TabItem<EmpireTab>[]>(() => [
		{ id: 'ships', label: $localize`:empire tab:Ships`, count: this.store.filteredShips().length },
		{ id: 'stations', label: $localize`:empire tab:Stations`, count: this.store.filteredStations().length },
		{ id: 'balance', label: $localize`:empire tab:Production balance`, count: this.store.filteredBalance().length },
	]);

	/** The ship counts by size, e.g. "Large 3 · Small 12". */
	protected readonly sizeSplit = computed(() =>
		this.store
			.summary()
			.bySize.filter((x) => x.count)
			.map((x) => `${EnumLabels.label(x.size)} ${x.count}`)
			.join(' · ')
	);
}
