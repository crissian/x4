import { StationResourceModel } from '../../station-calculator.model';
import { ResourcePriceType } from '../enums/resource-price-type.enum';
import { ResourcePricePercentage } from '../interfaces/resource-price-percentage';

/**
 * The Resource Summary model
 */
export class ResourceSummary {
	constructor(
		private model: StationResourceModel,
		private pricePercentage: ResourcePricePercentage,
		private priceType: ResourcePriceType,
		private warePrice: number = null
	) {}

	get name() {
		return this.model.ware.name;
	}

	get amount() {
		return this.model.amount;
	}

	get price() {
		if (this.warePrice != null) {
			return 0;
		}

		const percentage =
			this.priceType == ResourcePriceType.expense
				? this.pricePercentage.resourcesPrice
				: this.pricePercentage.productsPrice;
		return this.model.ware.price.min + ((this.model.ware.price.max - this.model.ware.price.min) * percentage) / 100;
	}
}
