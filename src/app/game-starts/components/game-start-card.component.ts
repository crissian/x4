import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EnumLabels } from '../../core/enum-labels';
import { GAME_VERSIONS } from '../../shared/services/constants';
import type { GameStartSummary } from '../game-start-summary';
import { GameStartTypes } from '../game-start-types';

/** A game start at a glance: type, DLC, money, ship and location, linking to its page. */
@Component({
	selector: 'app-game-start-card',
	imports: [DecimalPipe, RouterLink],
	templateUrl: './game-start-card.component.html',
})
export class GameStartCardComponent {
	readonly summary = input.required<GameStartSummary>();

	protected readonly start = computed(() => this.summary().start);
	protected readonly typeLabel = computed(() => GameStartTypes.label(this.start().type));
	protected readonly typeHint = computed(() => GameStartTypes.hint(this.start().type));
	protected readonly story = computed(() => GameStartTypes.isStory(this.start().type));
	protected readonly dlc = computed(() => GAME_VERSIONS[this.start().version]);
	protected readonly shipType = computed(() => {
		const type = this.summary().ship?.type;
		return type ? EnumLabels.label(type) : undefined;
	});
}
