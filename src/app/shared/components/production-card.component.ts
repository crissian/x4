import { Component, input } from '@angular/core';
import { ProductionData, formatProductionTime } from '../services/production';
import { ProductionRequirementsComponent } from './production-requirements.component';

/** Card with a production's requirements and cycle time. */
@Component({
	selector: 'app-production-card',
	imports: [ProductionRequirementsComponent],
	host: { class: 'card block' },
	templateUrl: './production-card.component.html',
})
export class ProductionCardComponent {
	readonly production = input.required<ProductionData>();
	protected readonly formatTime = formatProductionTime;
}
