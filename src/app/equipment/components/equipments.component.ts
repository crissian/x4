import { Component, inject } from '@angular/core';
import { EnumFn } from '../../core/services/enum-fn';
import { DataGridComponent, GridColumn, lookupOf } from '../../shared/components/data-grid/data-grid.component';
import { injectRowNavigation } from '../../shared/components/list-page';
import { EquipmentClass } from '../../shared/services/data/equipment-class-data';
import { EquipmentType } from '../../shared/services/data/equipment-type-data';
import { Size } from '../../shared/services/data/size-data';
import { EquipmentService } from '../../shared/services/equipment.service';
import { Equipment } from '../../shared/services/model/model';
import { RaceService } from '../../shared/services/race.service';

@Component({
	imports: [DataGridComponent],
	templateUrl: './equipments.component.html',
})
export class EquipmentsComponent {
	protected readonly entities = inject(EquipmentService).getEntities();
	protected readonly open = injectRowNavigation<Equipment>();

	protected readonly columns: GridColumn<Equipment>[] = [
		{ key: 'name', caption: 'Name' },
		{ key: 'size', caption: 'Size', lookup: lookupOf(EnumFn.values(Size)) },
		{
			key: 'race.id',
			caption: 'Race',
			lookup: inject(RaceService)
				.getEntities()
				.map((x) => ({ value: x.id, label: x.name })),
		},
		{ key: 'type', caption: 'Type', lookup: lookupOf(EnumFn.values(EquipmentType)) },
		{ key: 'equipmentClass', caption: 'Class', lookup: lookupOf(EnumFn.values(EquipmentClass)) },
	];
}
