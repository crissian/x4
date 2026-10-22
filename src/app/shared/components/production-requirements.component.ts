import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductionData, Production } from '../services/production';

/** Table of wares needed by a production, with min / max / avg prices. */
@Component({
	selector: 'app-production-requirements',
	imports: [DecimalPipe, RouterLink],
	templateUrl: './production-requirements.component.html',
})
export class ProductionRequirementsComponent {
	readonly production = input.required<ProductionData>();

	protected readonly totals = computed(() => ({
		min: Production.getProductionTotal(this.production(), 'min'),
		max: Production.getProductionTotal(this.production(), 'max'),
		avg: Production.getProductionTotal(this.production(), 'avg'),
	}));
}
