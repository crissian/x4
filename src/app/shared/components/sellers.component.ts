import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loadouts } from '../services/loadout';
import { Faction } from '../services/model/model';
import { ShipStatsService } from '../services/ship-stats.service';

/** Factions selling an item (ship, equipment, module blueprint) and the license / reputation each one asks for. */
@Component({
	selector: 'app-sellers',
	imports: [RouterLink],
	templateUrl: './sellers.component.html',
})
export class SellersComponent {
	private readonly stats = inject(ShipStatsService);

	readonly owners = input<Faction[]>();
	readonly license = input<string>();

	protected readonly sellers = computed(() => this.stats.sellers(this.owners(), this.license()));

	protected reputation(relation: number) {
		const value = Loadouts.relationToReputation(relation);
		return value > 0 ? `+${value}` : `${value}`;
	}
}
