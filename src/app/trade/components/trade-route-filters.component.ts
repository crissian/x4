import { Component, computed, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { EnumLabels } from '../../core/enum-labels';
import { TradeRoutesStore } from '../trade-routes-store';
import { SectorInputComponent } from '../../shared/components/sector-input.component';
import { SearchableSelectComponent } from '../../shared/components/searchable-select/searchable-select.component';
import { NumberFormats } from '../../core/format/number-formats';
import { ShipPickerOptions } from '../../savegame/own-ships/ship-picker-options';

/** The ship, location and ware filters of the trade routes page. */
@Component({
	selector: 'app-trade-route-filters',
	imports: [SearchableSelectComponent, SectorInputComponent, FormField],
	templateUrl: './trade-route-filters.component.html',
})
export class TradeRouteFiltersComponent {
	protected readonly store = inject(TradeRoutesStore);
	protected readonly form = this.store.form;
	protected readonly custom = TradeRoutesStore.CUSTOM;
	protected readonly cargoTypes = TradeRoutesStore.CARGO_TYPES.map((id) => ({
		id,
		label: EnumLabels.label(id.charAt(0).toUpperCase() + id.slice(1)),
	}));
	/** The wares the save's stations trade (about 60), searchable. */
	protected readonly wareOptions = computed(() => this.store.wares().map(({ id, name }) => ({ id, name })));
	/** Custom ship, the player's cargo ships by size, then the cargo ship models; searched by name, model and sector. */
	protected readonly shipOptions = computed(() => [
		{ id: TradeRoutesStore.CUSTOM, name: $localize`Custom ship` },
		...ShipPickerOptions.own(
			this.store.ownShips(),
			(own) => `${own.model.name}, ${NumberFormats.whole(own.capacity)} m³ · ${own.sectorName}`
		),
		...ShipPickerOptions.models(
			this.store.ships,
			(ship) => `${EnumLabels.label(ship.size)}, ${NumberFormats.whole(ship.capacity)} m³`
		),
	]);
}
