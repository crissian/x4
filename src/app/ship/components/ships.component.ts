import { Component, inject } from '@angular/core';
import { EnumFn } from '../../core/services/enum-fn';
import { DataGridComponent, GridColumn, lookupOf } from '../../shared/components/data-grid/data-grid.component';
import { injectRowNavigation } from '../../shared/components/list-page';
import { ShipPurpose } from '../../shared/services/data/ship-purpose-data';
import { ShipType } from '../../shared/services/data/ship-type-data';
import { Size } from '../../shared/services/data/size-data';
import { Ship } from '../../shared/services/model/model';
import { RaceService } from '../../shared/services/race.service';
import { ShipService } from '../../shared/services/ship.service';

@Component({
	imports: [DataGridComponent],
	templateUrl: './ships.component.html',
})
export class ShipsComponent {
	protected readonly entities = inject(ShipService).getEntities();
	protected readonly open = injectRowNavigation<Ship>();

	protected readonly columns: GridColumn<Ship>[] = [
		{ key: 'name', caption: 'Name' },
		{
			key: 'race.id',
			caption: 'Race',
			lookup: inject(RaceService)
				.getEntities()
				.map((x) => ({ value: x.id, label: x.name })),
		},
		{ key: 'type', caption: 'Type', lookup: lookupOf(EnumFn.values(ShipType)) },
		{ key: 'size', caption: 'Size', lookup: lookupOf(EnumFn.values(Size)) },
		{ key: 'purpose', caption: 'Purpose', lookup: lookupOf(EnumFn.values(ShipPurpose)) },
		{ key: 'weapons', caption: 'Weapons', type: 'number', value: (ship) => ship.weapons?.length ?? 0 },
		{ key: 'turrets', caption: 'Turrets', type: 'number', value: (ship) => ship.turrets?.length ?? 0 },
		{
			key: 'shields',
			caption: 'Shields',
			type: 'number',
			value: (ship) => ship.shields?.filter((x) => !x.group).length ?? 0,
		},
		{ key: 'people', caption: 'People', type: 'number' },
	];
}
