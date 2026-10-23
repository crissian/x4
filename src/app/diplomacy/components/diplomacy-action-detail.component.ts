import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Duration } from '../../core/format/duration';
import { NumberFormats } from '../../core/format/number-formats';
import { ActiveSave } from '../../savegame/active-save';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { EntityDetailPage } from '../../shared/components/entity-detail-page';
import { FactionLabelComponent } from '../../shared/components/faction-label.component';
import { WareAmountsComponent } from '../../shared/components/ware-amounts/ware-amounts.component';
import { GAME_VERSIONS } from '../../shared/services/constants';
import { DiplomacyService } from '../../shared/services/diplomacy.service';
import { FactionService } from '../../shared/services/faction.service';
import type { DiplomacyAction } from '../../shared/services/model/diplomacy';
import { DiplomacyColumns } from '../diplomacy-columns';
import { DiplomacyWares } from '../diplomacy-wares';

/** An agent action: what it takes, what it gives, its targets, and whether the menu of the active save shows it. */
@Component({
	selector: 'app-diplomacy-action-detail',
	imports: [DetailComponent, DetailPageComponent, FactionLabelComponent, RouterLink, WareAmountsComponent],
	templateUrl: './diplomacy-action-detail.component.html',
})
export class DiplomacyActionDetailComponent extends EntityDetailPage<DiplomacyAction> {
	protected readonly service = inject(DiplomacyService);
	private readonly factions = inject(FactionService);
	protected readonly wares = inject(DiplomacyWares);
	private readonly diplomacy = inject(ActiveSave).diplomacy;

	protected readonly info = computed(() => {
		const action = this.entity();
		return (
			action && {
				category: this.service.category(action.category),
				agentType: this.service.agentType(action.agentType),
				experience: DiplomacyColumns.experience(this.service, action.experience),
				risk: this.service.risk(action.risk),
				success: NumberFormats.percent(action.success.chance / 100),
				duration: Duration.short(action.duration),
				cooldown: Duration.short(action.cooldown),
				money: NumberFormats.whole(action.cost.money),
				version: action.version ? GAME_VERSIONS[action.version] : undefined,
			}
		);
	});

	/** The items the action takes as its optional gift. */
	protected readonly giftWares = computed(() => {
		const action = this.entity();
		return action ? this.wares.list(this.service.giftWares(action)) : [];
	});

	/** The targets, with the wares a ware target picks from and the factions it can't be. */
	protected readonly targets = computed(() =>
		(this.entity()?.targets ?? []).map((target) => ({
			target,
			wares: this.wares.list(target.wares ?? []),
			excluded: (target.excludedFactionTags ?? [])
				.flatMap((tag) => this.service.catalog.factionTags[tag] ?? [])
				.map((id) => this.factions.getEntity(id) ?? { id, name: id }),
		}))
	);

	/** Whether the menu of the active save shows the action; undefined without diplomacy in the save. */
	protected readonly shown = computed(() => {
		const save = this.diplomacy();
		return save?.found ? save.actions[this.id()] === true : undefined;
	});

	protected readonly giftEffect = this.service.catalog.giftEffect;
	protected readonly signed = NumberFormats.signedWhole;
}
