import { Component, computed, inject, input } from '@angular/core';
import { NgTemplateOutlet, PercentPipe } from '@angular/common';
import { EquipmentModService } from '../../shared/services/equipment-mod.service';
import type { EquipmentMod, ModEffect } from '../../shared/services/model/equipment-mod';
import { type EffectTone, ModEffects } from '../mod-effects';

interface EffectRow {
	stat: string;
	name: string;
	description?: string;
	range: string;
	tone: EffectTone;
	/** bonus effects of unequal weight: the share of the picks */
	odds?: number;
}

/** The main effect of a mod and its bonus effects, as readable ranges coloured by whether they help. */
@Component({
	selector: 'app-mod-effect-list',
	imports: [NgTemplateOutlet, PercentPipe],
	templateUrl: './mod-effect-list.component.html',
})
export class ModEffectListComponent {
	readonly mod = input.required<EquipmentMod>();
	private readonly service = inject(EquipmentModService);

	protected readonly main = computed(() => this.row(this.mod().effect));
	protected readonly bonus = computed(() => {
		const bonus = this.mod().bonus;
		return bonus
			? {
					heading: ModEffects.bonus(bonus),
					rows: bonus.effects.map((x) => this.row(x, ModEffects.odds(bonus, x))),
				}
			: undefined;
	});

	private row(effect: ModEffect, odds?: number): EffectRow {
		const stat = this.service.stat(effect.stat);
		return {
			stat: effect.stat,
			name: stat?.name ?? effect.stat,
			description: stat?.description,
			range: ModEffects.range(stat, effect),
			tone: ModEffects.tone(stat, effect),
			odds,
		};
	}
}
