import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NumberFormats } from '../../core/format/number-formats';
import { DiplomacyService } from '../../shared/services/diplomacy.service';
import { DiplomacyWares } from '../diplomacy-wares';

/** The diplomacy of a faction: the gifts listed for it and the agent actions that can't target it. */
@Component({
	selector: 'app-faction-diplomacy',
	imports: [RouterLink],
	templateUrl: './faction-diplomacy.component.html',
})
export class FactionDiplomacyComponent {
	readonly faction = input.required<string>();

	private readonly service = inject(DiplomacyService);
	private readonly wares = inject(DiplomacyWares);

	protected readonly gifts = computed(() =>
		this.wares.list(this.service.giftsFor(this.faction()).map((x) => x.ware))
	);
	protected readonly excluded = computed(() => this.service.excluding(this.faction()));
	protected readonly giftEffect = this.service.catalog.giftEffect;
	protected readonly signed = NumberFormats.signedWhole;
}
