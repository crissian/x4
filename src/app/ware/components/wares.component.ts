import { Component, inject } from '@angular/core';
import { GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { ListPageComponent } from '../../shared/components/list-page.component';
import { GridLookups } from '../../shared/components/data-grid/grid-lookups';
import { TransportType } from '../../shared/services/data/transport-data';
import { Ware } from '../../shared/services/model/model';
import { WareService } from '../../shared/services/ware.service';

@Component({
	imports: [ListPageComponent],
	templateUrl: './wares.component.html',
})
export class WaresComponent {
	protected readonly entities = inject(WareService).getEntities();

	protected readonly columns: GridColumn<Ware>[] = [
		{ key: 'name', caption: $localize`Name` },
		{ key: 'transport', caption: $localize`Transport`, lookup: GridLookups.ofEnum(TransportType) },
		{ key: 'price.min', caption: $localize`Min Price`, type: 'number' },
		{ key: 'price.avg', caption: $localize`Avg Price`, type: 'number' },
		{ key: 'price.max', caption: $localize`Max Price`, type: 'number' },
		{ key: 'volume', caption: $localize`Volume`, type: 'number' },
		{
			key: 'priceDiffPerVolume',
			caption: $localize`Price Diff / Volume`,
			type: 'number',
			format: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
			value: (ware) => (ware.price.max - ware.price.min) / ware.volume,
		},
	];
}
