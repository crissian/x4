import { signal } from '@angular/core';
import { Ware } from '../../../shared/services/model/model';

/** Rows of a summary table that are expanded to show their details. */
export class ExpandState {
	readonly state = signal<Record<string, boolean>>({});

	toggle(key: string) {
		this.state.update((state) => ({ ...state, [key]: !state[key] }));
	}
}

export class StationSummaryPrices {
	/** Ware price between min (0%) and max (100%) */
	static priceAt(ware: Ware, percentage: number) {
		return ware.price.min + ((ware.price.max - ware.price.min) * percentage) / 100;
	}

	/** label of a price slider value */
	static priceLabel(value: number) {
		switch (value) {
			case 0:
				return $localize`:@@min:Min`;
			case 50:
				return $localize`:@@average:Average`;
			case 100:
				return $localize`:@@max:Max`;
			default:
				return `${value}%`;
		}
	}
}
