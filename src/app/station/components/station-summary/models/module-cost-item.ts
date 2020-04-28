import { Ware } from 'src/app/shared/services/model/model';
import { StationSummaryComponent } from '../station-summary.component';

/**
 * The Module Cost Item model
 */
export class ModuleCostItem {
	constructor(public ware: Ware, public amount: number, private component: StationSummaryComponent) {}

	get price() {
		return (
			this.amount *
			(this.ware.price.min +
				((this.ware.price.max - this.ware.price.min) * this.component.modulesResourcesPrice) / 100)
		);
	}
}
