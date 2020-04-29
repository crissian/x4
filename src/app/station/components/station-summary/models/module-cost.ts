import { StationModuleModel } from '../../station-calculator.model';
import { StationSummaryComponent } from '../station-summary.component';
import { ModuleCostItem } from './module-cost-item';

/**
 * The Module Cost model
 */
export class ModuleCost {
	constructor(
		private item: StationModuleModel,
		private component: StationSummaryComponent,
		private minPrice: number,
		private maxPrice,
		public items: ModuleCostItem[]
	) {}

	get module() {
		return this.item.module;
	}

	get count() {
		return this.item.count;
	}

	get price() {
		return (
			this.item.count *
			(this.minPrice + ((this.maxPrice - this.minPrice) * this.component.modulesResourcesPrice) / 100)
		);
	}
}
