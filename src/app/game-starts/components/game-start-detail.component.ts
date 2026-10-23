import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EnumLabels } from '../../core/enum-labels';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { EntityDetailPage } from '../../shared/components/entity-detail-page';
import { FactionLabelComponent } from '../../shared/components/faction-label.component';
import { GAME_VERSIONS } from '../../shared/services/constants';
import { FactionService } from '../../shared/services/faction.service';
import { Loadouts } from '../../shared/services/loadout';
import { ShipListService } from '../../shared/services/ship-list.service';
import { SectorService } from '../../shared/services/universe.service';
import { GameStartDetails } from '../game-start-details';
import type { GameStart } from '../game-start-model';
import { GameStartSummaries } from '../game-start-summary';
import { GameStartTypes } from '../game-start-types';
import { GameStartService } from '../game-start.service';
import { GameStartItemsComponent } from './game-start-items.component';

/** The start menu lines the facts at the top of the page show already. */
const SHOWN_INFO = new Set(['location', 'ship', 'cash']);

/** A game start: what the player starts with, where, and how the factions see them. */
@Component({
	imports: [
		DecimalPipe,
		RouterLink,
		DetailPageComponent,
		DetailComponent,
		FactionLabelComponent,
		GameStartItemsComponent,
	],
	templateUrl: './game-start-detail.component.html',
})
export class GameStartDetailComponent extends EntityDetailPage<GameStart> {
	protected readonly service = inject(GameStartService);
	private readonly ships = inject(ShipListService);
	private readonly sectors = inject(SectorService);
	private readonly factions = inject(FactionService);

	protected readonly summary = computed(() => {
		const start = this.entity();
		return (
			start &&
			GameStartSummaries.of(
				start,
				(id) => this.ships.getEntity(id),
				(id) => this.sectors.getEntity(id)
			)
		);
	});
	protected readonly dlc = computed(() => GAME_VERSIONS[this.entity()?.version ?? 0]);
	protected readonly type = computed(() => {
		const type = this.entity()?.type;
		return type && { label: GameStartTypes.label(type), hint: GameStartTypes.hint(type) };
	});
	protected readonly shipType = computed(() => {
		const type = this.summary()?.ship?.type;
		return type ? EnumLabels.label(type) : undefined;
	});
	protected readonly reputations = computed(() =>
		GameStartDetails.reputations(this.entity()?.relations, (x) => Loadouts.relationToReputation(x)).map((x) => ({
			...x,
			entity: this.factions.getEntity(x.faction),
		}))
	);
	protected readonly blueprints = computed(() => {
		const start = this.entity();
		return start && GameStartDetails.blueprints(start);
	});
	protected readonly info = computed(() => (this.entity()?.info ?? []).filter((x) => !SHOWN_INFO.has(x.key ?? '')));
}
