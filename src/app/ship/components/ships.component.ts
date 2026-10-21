import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideGitCompareArrows } from '@lucide/angular';
import { EnumFn } from '../../core/services/enum-fn';
import { DataGridComponent, GridColumn, lookupOf } from '../../shared/components/data-grid/data-grid.component';
import { injectRowNavigation } from '../../shared/components/list-page';
import { ShipPurpose } from '../../shared/services/data/ship-purpose-data';
import { ShipType } from '../../shared/services/data/ship-type-data';
import { Size } from '../../shared/services/data/size-data';
import { Ship } from '../../shared/services/model/model';
import { RaceService } from '../../shared/services/race.service';
import { ShipStatsService } from '../../shared/services/ship-stats.service';
import { ShipService } from '../../shared/services/ship.service';
import { GAME_VERSION_LOOKUP } from '../../shared/services/constants';

@Component({
	imports: [DataGridComponent, RouterLink, LucideGitCompareArrows],
	templateUrl: './ships.component.html',
})
export class ShipsComponent {
	private readonly stats = inject(ShipStatsService);

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
		{ key: 'hull', caption: 'Hull', type: 'number' },
		{ key: 'shield', caption: 'Max Shield', type: 'number', value: (ship) => this.stats.maxStats(ship).shield || null },
		{ key: 'speed', caption: 'Max Speed', type: 'number', value: (ship) => this.stats.maxStats(ship).speed || null },
		{ key: 'boost', caption: 'Max Boost', type: 'number', hidden: true, value: (ship) => this.stats.maxStats(ship).boost || null },
		{ key: 'travel', caption: 'Max Travel', type: 'number', value: (ship) => this.stats.maxStats(ship).travel || null },
		{ key: 'cargo', caption: 'Cargo', type: 'number', value: (ship) => this.stats.maxStats(ship).cargo || null },
		{ key: 'cargoTypes', caption: 'Cargo Type', hidden: true, value: (ship) => this.stats.maxStats(ship).cargoTypes },
		{ key: 'weapons', caption: 'Weapons', type: 'number', value: (ship) => ship.weapons?.length ?? 0 },
		{ key: 'turrets', caption: 'Turrets', type: 'number', value: (ship) => ship.turrets?.length ?? 0 },
		{
			key: 'shields',
			caption: 'Shields',
			type: 'number',
			hidden: true,
			value: (ship) => ship.shields?.filter((x) => !x.group).length ?? 0,
		},
		{ key: 'storage.missile', caption: 'Missiles', type: 'number', hidden: true },
		{ key: 'storage.unit', caption: 'Drones', type: 'number', hidden: true },
		{ key: 'people', caption: 'Crew', type: 'number', hidden: true },
		{ key: 'mass', caption: 'Mass', type: 'number', hidden: true, format: { maximumFractionDigits: 1 } },
		{ key: 'price.avg', caption: 'Price', type: 'number' },
		{
			key: 'version',
			caption: 'DLC',
			hidden: true,
			lookup: GAME_VERSION_LOOKUP,
		},
	];
}
