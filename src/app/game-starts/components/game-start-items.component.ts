import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { GameStartItem } from '../game-start-model';

/** A card listing wares of a game start with their counts, linked to their module, ship or equipment page. */
@Component({
	selector: 'app-game-start-items',
	imports: [RouterLink],
	templateUrl: './game-start-items.component.html',
})
export class GameStartItemsComponent {
	readonly heading = input.required<string>();
	readonly items = input.required<readonly GameStartItem[]>();
}
