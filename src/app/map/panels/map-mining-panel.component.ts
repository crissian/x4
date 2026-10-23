import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { MapStore } from '../map-store';
import { MiningBuyersStore } from '../mining/mining-buyers-store';
import { MiningBuyersTableComponent } from '../mining/mining-buyers-table.component';
import { JumpsPipe } from '../../core/format/jumps.pipe';
import { Duration } from '../../core/format/duration';
import { SectorInputComponent } from '../../shared/components/sector-input.component';
import { SearchableSelectComponent } from '../../shared/components/searchable-select/searchable-select.component';
import { MinerPicker } from '../mining/miner-picker';

@Component({
	selector: 'app-map-mining-panel',
	imports: [
		SectorInputComponent,
		JumpsPipe,
		DecimalPipe,
		SearchableSelectComponent,
		FormField,
		MiningBuyersTableComponent,
		RouterLink,
	],
	providers: [MiningBuyersStore],
	templateUrl: './map-mining-panel.component.html',
})
export class MapMiningPanelComponent {
	protected readonly store = inject(MapStore);
	/** With a save: real buyers instead of static prices */
	protected readonly buyers = inject(MiningBuyersStore);
	protected readonly form = this.store.miningForm;
	protected readonly duration = Duration.short;
	/** The player's ships able to mine the resource by size, then the miner models. */
	protected readonly minerOptions = computed(() => {
		const ware = this.store.miningWare();
		return ware ? MinerPicker.options(this.store.ownMiners(), this.store.miners(), ware) : [];
	});
}
