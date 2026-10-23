import { Component, computed, inject, input } from '@angular/core';
import { Loadouts } from '../services/loadout';
import { Faction } from '../services/model/model';
import { FactionService } from '../services/faction.service';
import { FactionLabelComponent } from './faction-label.component';

/** Factions selling an item (ship, equipment, module blueprint) and the license / reputation each one asks for. */
@Component({
	selector: 'app-sellers',
	imports: [FactionLabelComponent],
	templateUrl: './sellers.component.html',
})
export class SellersComponent {
	private readonly factions = inject(FactionService);

	readonly owners = input<Faction[]>();
	readonly license = input<string>();

	protected readonly sellers = computed(() => this.factions.sellers(this.owners(), this.license()));

	protected reputation(relation: number) {
		const value = Loadouts.relationToReputation(relation);
		return value > 0 ? `+${value}` : `${value}`;
	}
}
