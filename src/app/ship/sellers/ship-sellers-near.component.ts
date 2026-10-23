import { Component, inject, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { StationTypeBadgeComponent } from '../../map/station-type-badge.component';
import { RoutePlanner } from '../../map/route-planner';
import { Tone, ToneDotComponent } from '../../shared/components/tone-dot/tone-dot.component';
import type { Ship } from '../../shared/services/model/model';
import { StandingStatus } from './seller-standing';
import { ShipSellerFinder } from './ship-seller-finder';

/**
 * "Where to buy": the wharfs and shipyards selling a ship, nearest first from a sector the player picks, with the
 * standing the active save gives (or only the requirement without a save).
 */
@Component({
	selector: 'app-ship-sellers-near',
	imports: [RouterLink, FormField, StationTypeBadgeComponent, ToneDotComponent],
	templateUrl: './ship-sellers-near.component.html',
	providers: [ShipSellerFinder],
})
export class ShipSellersNearComponent {
	readonly ship = input.required<Ship>();

	protected readonly finder = inject(ShipSellerFinder);
	protected readonly form = this.finder.form;
	protected readonly speed = ShipSellerFinder.SPEED;
	protected readonly charge = ShipSellerFinder.CHARGE;
	protected readonly duration = RoutePlanner.formatDuration;

	private static readonly TONES: Record<StandingStatus, Tone> = {
		ok: 'green',
		reputation: 'amber',
		ceremony: 'orange',
		enemy: 'red',
		unknown: 'grey',
	};

	constructor() {
		this.finder.connect(this.ship);
	}

	protected tone(status: StandingStatus): Tone {
		return ShipSellersNearComponent.TONES[status];
	}

	/** Reputation points with their sign, e.g. "+10". */
	protected points(value: number | undefined): string {
		return value != null && value > 0 ? `+${value}` : `${value ?? 0}`;
	}
}
