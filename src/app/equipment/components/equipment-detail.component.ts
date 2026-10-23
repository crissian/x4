import { Descriptions } from '../../shared/services/descriptions';
import { DecimalPipe } from '@angular/common';
import { EnumLabelPipe, EnumLabels } from '../../core/enum-labels';
import { Component, computed, inject } from '@angular/core';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { ProducibleDetailPage } from '../../shared/components/entity-detail-page';
import { EntityLinkComponent } from '../../shared/components/entity-link.component';
import { ProductionCardsComponent } from '../../shared/components/production-cards.component';
import { RowNavigation } from '../../shared/components/row-navigation';
import { PriceRangePipe } from '../../core/format/price-range.pipe';
import { SellersComponent } from '../../shared/components/sellers.component';
import { EquipmentService } from '../../shared/services/equipment.service';
import { ShipPerformance } from '../../shared/services/ship-performance';
import { Equipment, Ship } from '../../shared/services/model/model';
import { ShipStatsService } from '../../shared/services/ship-stats.service';
import { ShipService } from '../../shared/services/ship.service';
import { EquipmentModService } from '../../shared/services/equipment-mod.service';
import { ModsForComponent } from '../../mods/components/mods-for.component';
import { ModSlots } from '../../mods/mod-slots';

interface ShipRow {
	ship: Ship;
	/** Number of slots taking this equipment. */
	slots: number;
}

@Component({
	imports: [
		DetailPageComponent,
		DetailComponent,
		DecimalPipe,
		EntityLinkComponent,
		DataGridComponent,
		ProductionCardsComponent,
		SellersComponent,
		EnumLabelPipe,
		PriceRangePipe,
		ModsForComponent,
	],
	templateUrl: './equipment-detail.component.html',
})
export class EquipmentDetailComponent extends ProducibleDetailPage<Equipment> {
	protected readonly service = inject(EquipmentService);
	protected readonly description = Descriptions.of('equipment', this.id);
	private readonly shipService = inject(ShipService);
	private readonly stats = inject(ShipStatsService);

	protected readonly weapon = computed(() => {
		const weapon = this.entity()?.weapon;
		return weapon ? ShipPerformance.weaponStats(weapon) : undefined;
	});
	protected readonly missileDps = computed(() => {
		const missile = this.entity()?.missile;
		return missile ? ShipPerformance.missileDps(missile) : undefined;
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
		{ key: 'ship.name', caption: $localize`Ship` },
		{ key: 'ship.size', caption: $localize`Size`, value: (x) => EnumLabels.label(x.ship.size) },
		{ key: 'ship.type', caption: $localize`Type`, value: (x) => EnumLabels.label(x.ship.type) },
		{ key: 'slots', caption: $localize`Slots`, type: 'number' },
	];
	protected readonly trackShip = (row: ShipRow) => row.ship.id;

	protected readonly labels = {
		repair: $localize`Repair/s`,
		dps: $localize`DPS`,
		beamDamage: $localize`Damage/s (beam)`,
		damage: $localize`Damage`,
		yes: $localize`:@@yes:Yes`,
		no: $localize`:@@no:No`,
	};

	/** The mods that fit this equipment and change a stat it has, the player's own only. */
	private readonly modService = inject(EquipmentModService);
	protected readonly modSlot = computed(() => {
		const entity = this.entity();
		return entity && ModSlots.ofEquipment(entity);
	});
	protected readonly mods = computed(() => {
		const entity = this.entity();
		return entity ? ModSlots.forEquipment(this.modService.getEntities().filter((x) => !x.notForPlayer), entity) : [];
	});

	protected readonly openShip = RowNavigation.to<ShipRow>('/ships', (x) => x.ship.id);
}
