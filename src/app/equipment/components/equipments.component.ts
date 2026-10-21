import { Component, inject } from '@angular/core';
import { EnumFn } from '../../core/services/enum-fn';
import { DataGridComponent, GridColumn, lookupOf } from '../../shared/components/data-grid/data-grid.component';
import { injectRowNavigation } from '../../shared/components/list-page';
import { EquipmentClass } from '../../shared/services/data/equipment-class-data';
import { EquipmentType } from '../../shared/services/data/equipment-type-data';
import { Size } from '../../shared/services/data/size-data';
import { EquipmentService } from '../../shared/services/equipment.service';
import { WeaponStats, missileDps, weaponStats } from '../../shared/services/loadout';
import { Equipment } from '../../shared/services/model/model';
import { RaceService } from '../../shared/services/race.service';
import { GAME_VERSION_LOOKUP } from '../../shared/services/constants';

@Component({
	imports: [DataGridComponent],
	templateUrl: './equipments.component.html',
})
export class EquipmentsComponent {
	protected readonly entities = inject(EquipmentService).getEntities();
	protected readonly open = injectRowNavigation<Equipment>();

	private readonly weaponCache = new Map<string, WeaponStats>();

	private weapon(equipment: Equipment): WeaponStats | undefined {
		if (!equipment.weapon || equipment.weapon.repair) {
			return undefined;
		}
		let stats = this.weaponCache.get(equipment.id);
		if (!stats) {
			stats = weaponStats(equipment.weapon);
			this.weaponCache.set(equipment.id, stats);
		}
		return stats;
	}

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
		{ key: 'price.avg', caption: 'Price', type: 'number' },
		{ key: 'hull', caption: 'Hull', type: 'number', hidden: true },
		{
			key: 'dps',
			caption: 'DPS',
			type: 'number',
			value: (x) => this.weapon(x)?.sustainedDps ?? (x.missile ? missileDps(x.missile) : null),
		},
		{
			key: 'range',
			caption: 'Range (km)',
			type: 'number',
			format: { maximumFractionDigits: 1 },
			value: (x) => {
				const range = x.weapon?.range ?? x.missile?.range;
				return range ? range / 1000 : null;
			},
		},
		{ key: 'missile.damage', caption: 'Missile Damage', type: 'number', hidden: true },
		{ key: 'recharge.max', caption: 'Shield', type: 'number' },
		{ key: 'recharge.rate', caption: 'Recharge (/s)', type: 'number', hidden: true },
		{ key: 'thrust.forward', caption: 'Thrust', type: 'number' },
		{ key: 'boost.thrust', caption: 'Boost ×', type: 'number', hidden: true, format: { maximumFractionDigits: 2 } },
		{ key: 'travel.thrust', caption: 'Travel ×', type: 'number', format: { maximumFractionDigits: 2 } },
		{ key: 'travel.charge', caption: 'Travel Charge (s)', type: 'number', hidden: true, format: { maximumFractionDigits: 1 } },
		{ key: 'license', caption: 'License', hidden: true },
		{
			key: 'version',
			caption: 'DLC',
			hidden: true,
			lookup: GAME_VERSION_LOOKUP,
		},
	];
}
