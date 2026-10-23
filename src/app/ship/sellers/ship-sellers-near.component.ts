import { Component, inject, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { StationTypeBadgeComponent } from '../../map/station-type-badge.component';
import { Tone, ToneDotComponent } from '../../shared/components/tone-dot/tone-dot.component';
import type { Ship } from '../../shared/services/model/model';
import { StandingStatus } from './seller-standing';
import { ShipSellerFinder } from './ship-seller-finder';
import { Duration } from '../../core/format/duration';
import { RoutePlanner } from '../../map/route-planner';
import { FactionLabelComponent } from '../../shared/components/faction-label.component';
import { SectorInputComponent } from '../../shared/components/sector-input.component';

/**
 * "Where to buy": the wharfs and shipyards selling a ship, nearest first from a sector the player picks, with the
 * standing the active save gives (or only the requirement without a save).
 */
@Component({
	selector: 'app-ship-sellers-near',
	imports: [
		SectorInputComponent,
		FactionLabelComponent,
		RouterLink,
		FormField,
		StationTypeBadgeComponent,
		ToneDotComponent,
	],
	templateUrl: './ship-sellers-near.component.html',
	providers: [ShipSellerFinder],
})
export class ShipSellersNearComponent {
	readonly ship = input.required<Ship>();

	protected readonly finder = inject(ShipSellerFinder);
	protected readonly form = this.finder.form;
	/** The travel drive speed and charge the times assume: the map route panel's defaults. */
	protected readonly speed = RoutePlanner.DEFAULT_OPTIONS.speed;
	protected readonly charge = RoutePlanner.DEFAULT_OPTIONS.charge;
	protected readonly duration = Duration.short;

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
