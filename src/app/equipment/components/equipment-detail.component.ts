import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { Router, RouterLink } from '@angular/router';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { ProductionCardComponent } from '../../shared/components/production-card.component';
import { SellersComponent } from '../../shared/components/sellers.component';
import { EquipmentService } from '../../shared/services/equipment.service';
import { missileDps, weaponStats } from '../../shared/services/loadout';
import { Ship } from '../../shared/services/model/model';
import { toProductionData } from '../../shared/services/production';
import { ShipStatsService } from '../../shared/services/ship-stats.service';
import { ShipService } from '../../shared/services/ship.service';
import { WareService } from '../../shared/services/ware.service';

interface ShipRow {
	ship: Ship;
	/** Number of slots taking this equipment. */
	slots: number;
}

@Component({
	imports: [DetailPageComponent, DetailComponent, DecimalPipe, RouterLink, DataGridComponent, ProductionCardComponent, SellersComponent],
	templateUrl: './equipment-detail.component.html',
})
export class EquipmentDetailComponent {
	private readonly service = inject(EquipmentService);
	private readonly shipService = inject(ShipService);
	private readonly wareService = inject(WareService);
	private readonly stats = inject(ShipStatsService);
	private readonly router = inject(Router);

	readonly id = input.required<string>();
	protected readonly entity = computed(() => this.service.getEntity(this.id()));
	protected readonly production = computed(() => toProductionData(this.entity()?.production, this.wareService));
	protected readonly weapon = computed(() => {
		const weapon = this.entity()?.weapon;
		return weapon ? weaponStats(weapon) : undefined;
	});
	protected readonly missileDps = computed(() => {
		const missile = this.entity()?.missile;
		return missile ? missileDps(missile) : undefined;
	});

	/** Ships with at least one slot this equipment fits. */
	protected readonly ships = computed<ShipRow[]>(() => {
		const id = this.id();
		const rows: ShipRow[] = [];
		for (const ship of this.shipService.getEntities()) {
			const slots = this.stats
				.groups(ship)
				.filter((group) => group.options.some((x) => x.id === id))
				.reduce((total, group) => total + group.slots.length, 0);
			if (slots) {
				rows.push({ ship, slots });
			}
		}
		return rows;
	});

	protected readonly shipColumns: GridColumn<ShipRow>[] = [
		{ key: 'ship.name', caption: 'Ship' },
		{ key: 'ship.size', caption: 'Size' },
		{ key: 'ship.type', caption: 'Type' },
		{ key: 'slots', caption: 'Slots', type: 'number' },
	];
	protected readonly trackShip = (row: ShipRow) => row.ship.id;

	protected openShip(row: ShipRow) {
		this.router.navigate(['/ships', row.ship.id]);
	}
}
