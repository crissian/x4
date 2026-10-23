import { Component, inject } from '@angular/core';
import { GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { ListPageComponent } from '../../shared/components/list-page.component';
import { GridLookups } from '../../shared/components/data-grid/grid-lookups';
import { Effects } from '../../shared/services/data/effects-data';
import { ModuleTypes } from '../../shared/services/data/module-types-data';
import { StationModule } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';

@Component({
	imports: [ListPageComponent],
	templateUrl: './modules.component.html',
})
export class ModulesComponent {
	protected readonly entities = inject(ModuleService).getEntities();

	protected readonly columns: GridColumn<StationModule>[] = [
		{ key: 'name', caption: $localize`Name` },
		{ key: 'type', caption: $localize`Type`, lookup: GridLookups.ofEnum(ModuleTypes) },
		{
			key: 'makerRace.id',
			caption: $localize`Race`,
			lookup: GridLookups.races(),
		},
		{
			key: 'productName',
			caption: $localize`Product`,
			value: (item) => item.product?.map((x) => x.name).join(', '),
		},
		{
			key: 'maxEfficiency',
			caption: $localize`Max Efficiency`,
			type: 'number',
			value: (item) => (item.product == null ? null : ModulesComponent.maxEfficiency(item)),
			display: (item) => (item.product == null ? '-' : `${ModulesComponent.maxEfficiency(item)}%`),
		},
	];

	private static maxEfficiency(item: StationModule) {
		if (item.product != null) {
			const effect = item.product
				.map((x) => x.production?.map((p) => p.effects?.find((y) => y.type === Effects.work)))
				.map((x) => x?.[0])
				.filter((x) => x != null)
				.map((x) => x.product);

			if (effect?.length > 0) {
				return 100 * (1 + Math.max(...effect));
			}
		}

		return 100;
	}
}
