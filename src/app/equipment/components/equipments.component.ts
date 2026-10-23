import { Component, inject } from '@angular/core';
import { GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { ListPageComponent } from '../../shared/components/list-page.component';
import { GridLookups } from '../../shared/components/data-grid/grid-lookups';
import { EquipmentClass } from '../../shared/services/data/equipment-class-data';
import { EquipmentType } from '../../shared/services/data/equipment-type-data';
import { Size } from '../../shared/services/data/size-data';
import { EquipmentService } from '../../shared/services/equipment.service';
import { ShipPerformance, WeaponStats } from '../../shared/services/ship-performance';
import { Equipment } from '../../shared/services/model/model';
import { GAME_VERSION_LOOKUP } from '../../shared/services/constants';

@Component({
	imports: [ListPageComponent],
	templateUrl: './equipments.component.html',
})
export class EquipmentsComponent {
	protected readonly entities = inject(EquipmentService).getEntities();

	private readonly weaponCache = new Map<string, WeaponStats>();

	private weapon(equipment: Equipment): WeaponStats | undefined {
		if (!equipment.weapon || equipment.weapon.repair) {
			return undefined;
		}
		let stats = this.weaponCache.get(equipment.id);
		if (!stats) {
			stats = ShipPerformance.weaponStats(equipment.weapon);
			this.weaponCache.set(equipment.id, stats);
		}
		return stats;
	}

	protected readonly columns: GridColumn<Equipment>[] = [
		{ key: 'name', caption: $localize`Name` },
		{ key: 'size', caption: $localize`Size`, lookup: GridLookups.ofEnum(Size) },
		{
			key: 'race.id',
			caption: $localize`Race`,
			lookup: GridLookups.races(),
		},
		{ key: 'type', caption: $localize`Type`, lookup: GridLookups.ofEnum(EquipmentType) },
		{ key: 'equipmentClass', caption: $localize`Class`, lookup: GridLookups.ofEnum(EquipmentClass) },
		{ key: 'price.avg', caption: $localize`Price`, type: 'number' },
		{ key: 'hull', caption: $localize`Hull`, type: 'number', hidden: true },
		{
			key: 'dps',
			caption: $localize`DPS`,
			type: 'number',
			value: (x) => this.weapon(x)?.sustainedDps ?? (x.missile ? ShipPerformance.missileDps(x.missile) : null),
		},
		{
			key: 'range',
			caption: $localize`Range (km)`,
			type: 'number',
			format: { maximumFractionDigits: 1 },
			value: (x) => {
				const range = x.weapon?.range ?? x.missile?.range;
				return range ? range / 1000 : null;
			},
		},
		{ key: 'missile.damage', caption: $localize`Missile Damage`, type: 'number', hidden: true },
		{ key: 'recharge.max', caption: $localize`Shield`, type: 'number' },
		{ key: 'recharge.rate', caption: $localize`Recharge (/s)`, type: 'number', hidden: true },
		{ key: 'thrust.forward', caption: $localize`Thrust`, type: 'number' },
		{ key: 'boost.thrust', caption: $localize`Boost ×`, type: 'number', hidden: true, format: { maximumFractionDigits: 2 } },
		{ key: 'travel.thrust', caption: $localize`Travel ×`, type: 'number', format: { maximumFractionDigits: 2 } },
		{ key: 'travel.charge', caption: $localize`Travel Charge (s)`, type: 'number', hidden: true, format: { maximumFractionDigits: 1 } },
		{ key: 'license', caption: $localize`License`, hidden: true },
		{
			key: 'version',
			caption: $localize`DLC`,
			hidden: true,
			lookup: GAME_VERSION_LOOKUP,
		},
	];
}
