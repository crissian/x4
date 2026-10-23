import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideGitCompareArrows } from '@lucide/angular';
import { GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { ListPageComponent } from '../../shared/components/list-page.component';
import { GridLookups } from '../../shared/components/data-grid/grid-lookups';
import { ShipPurpose } from '../../shared/services/data/ship-purpose-data';
import { ShipType } from '../../shared/services/data/ship-type-data';
import { Size } from '../../shared/services/data/size-data';
import { Ship } from '../../shared/services/model/model';
import { ShipStatsService } from '../../shared/services/ship-stats.service';
import { ShipService } from '../../shared/services/ship.service';
import { GAME_VERSION_LOOKUP } from '../../shared/services/constants';

@Component({
	imports: [ListPageComponent, RouterLink, LucideGitCompareArrows],
	templateUrl: './ships.component.html',
})
export class ShipsComponent {
	private readonly stats = inject(ShipStatsService);

	protected readonly entities = inject(ShipService).getEntities();

	protected readonly columns: GridColumn<Ship>[] = [
		{ key: 'name', caption: $localize`Name` },
		{
			key: 'race.id',
			caption: $localize`Race`,
			lookup: GridLookups.races(),
		},
		{ key: 'type', caption: $localize`Type`, lookup: GridLookups.ofEnum(ShipType) },
		{ key: 'size', caption: $localize`Size`, lookup: GridLookups.ofEnum(Size) },
		{ key: 'purpose', caption: $localize`Purpose`, lookup: GridLookups.ofEnum(ShipPurpose) },
		{ key: 'hull', caption: $localize`Hull`, type: 'number' },
		{ key: 'shield', caption: $localize`Max Shield`, type: 'number', value: (ship) => this.stats.maxStats(ship).shield || null },
		{ key: 'speed', caption: $localize`Max Speed`, type: 'number', value: (ship) => this.stats.maxStats(ship).speed || null },
		{ key: 'boost', caption: $localize`Max Boost`, type: 'number', hidden: true, value: (ship) => this.stats.maxStats(ship).boost || null },
		{ key: 'travel', caption: $localize`Max Travel`, type: 'number', value: (ship) => this.stats.maxStats(ship).travel || null },
		{ key: 'cargo', caption: $localize`Cargo`, type: 'number', value: (ship) => this.stats.maxStats(ship).cargo || null },
		{ key: 'cargoTypes', caption: $localize`Cargo Type`, hidden: true, value: (ship) => this.stats.maxStats(ship).cargoTypes },
		{ key: 'weapons', caption: $localize`Weapons`, type: 'number', value: (ship) => ship.weapons?.length ?? 0 },
		{ key: 'turrets', caption: $localize`Turrets`, type: 'number', value: (ship) => ship.turrets?.length ?? 0 },
		{
			key: 'shields',
			caption: $localize`Shields`,
			type: 'number',
			hidden: true,
			value: (ship) => ship.shields?.filter((x) => !x.group).length ?? 0,
		},
		{ key: 'storage.missile', caption: $localize`Missiles`, type: 'number', hidden: true },
		{ key: 'storage.unit', caption: $localize`Drones`, type: 'number', hidden: true },
		{ key: 'people', caption: $localize`Crew`, type: 'number', hidden: true },
		{ key: 'mass', caption: $localize`Mass`, type: 'number', hidden: true, format: { maximumFractionDigits: 1 } },
		{ key: 'price.avg', caption: $localize`Price`, type: 'number' },
		{
			key: 'version',
			caption: $localize`DLC`,
			hidden: true,
			lookup: GAME_VERSION_LOOKUP,
		},
	];
}
