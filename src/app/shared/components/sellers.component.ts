import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { relationToReputation } from '../services/loadout';
import { Faction } from '../services/model/model';
import { ShipStatsService } from '../services/ship-stats.service';

/** Factions selling an item (ship, equipment, module blueprint) and the license / reputation each one asks for. */
@Component({
	selector: 'app-sellers',
	imports: [RouterLink],
	template: `
		@for (item of sellers(); track item.faction.id) {
			<div>
				<a [routerLink]="['/factions', item.faction.id]">{{ item.faction.name }}</a>
				@if (item.license) {
					<span class="text-fg-muted">
						- {{ item.license.name }}
						@if (item.license.minRelation != null) {
							<ng-container i18n>(reputation {{ reputation(item.license.minRelation) }}+)</ng-container>
						}
					</span>
				}
			</div>
		} @empty {
			-
		}
	`,
})
export class SellersComponent {
	private readonly stats = inject(ShipStatsService);

	readonly owners = input<Faction[]>();
	readonly license = input<string>();

	protected readonly sellers = computed(() => this.stats.sellers(this.owners(), this.license()));

	protected reputation(relation: number) {
		const value = relationToReputation(relation);
		return value > 0 ? `+${value}` : `${value}`;
	}
}
