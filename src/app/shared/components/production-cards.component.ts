import { Component, input } from '@angular/core';
import { ProductionData } from '../services/production';
import { ProductionCardComponent } from './production-card.component';

/** The production cards of an item in a grid under an optional heading; nothing at all without productions. */
@Component({
	selector: 'app-production-cards',
	imports: [ProductionCardComponent],
	templateUrl: './production-cards.component.html',
})
export class ProductionCardsComponent {
	readonly items = input.required<readonly ProductionData[]>();
	readonly heading = input<string>();
}
