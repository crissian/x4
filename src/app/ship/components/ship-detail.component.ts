import { DecimalPipe } from '@angular/common';
import { EnumLabelPipe, enumLabel } from '../../core/enum-labels';
import { Component, computed, inject, input } from '@angular/core';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { Router, RouterLink } from '@angular/router';
import { LucideGitCompareArrows, LucideWrench } from '@lucide/angular';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { ProductionCardComponent } from '../../shared/components/production-card.component';
import { SellersComponent } from '../../shared/components/sellers.component';
import { flightSpeeds } from '../../shared/services/loadout';
import { Equipment, ShipCargo } from '../../shared/services/model/model';
import { getSlotsStr, toProductionData } from '../../shared/services/production';
import { ShipStatsService } from '../../shared/services/ship-stats.service';
import { ShipService } from '../../shared/services/ship.service';
import { WareService } from '../../shared/services/ware.service';
import { addToComparison } from './ship-compare.component';

interface EngineRow {
	engine: Equipment;
	speed: number;
	boost: number;
	travel: number;
	charge: number;
}

@Component({
	imports: [DetailPageComponent, DetailComponent, DecimalPipe, RouterLink, ProductionCardComponent, SellersComponent, DataGridComponent, LucideWrench, LucideGitCompareArrows, EnumLabelPipe],
	templateUrl: './ship-detail.component.html',
})
export class ShipDetailComponent {
	private readonly service = inject(ShipService);
	private readonly wareService = inject(WareService);
	private readonly stats = inject(ShipStatsService);
	private readonly router = inject(Router);

	readonly id = input.required<string>();

	protected readonly entity = computed(() => this.service.getEntity(this.id()));
	protected readonly production = computed(() => toProductionData(this.entity()?.production, this.wareService));
	protected readonly mainShields = computed(() => this.entity()?.shields?.filter((x) => !x.group) ?? []);
	protected readonly additionalShields = computed(() => this.entity()?.shields?.filter((x) => x.group) ?? []);
	protected readonly maxStats = computed(() => {
		const ship = this.entity();
		return ship ? this.stats.maxStats(ship) : undefined;
	});

	protected readonly engines = computed<EngineRow[]>(() => {
		const ship = this.entity();
		if (!ship) {
			return [];
		}
		return this.stats.engines(ship).map((engine) => {
			const speeds = flightSpeeds(ship, engine);
			return { engine, speed: speeds.speed, boost: speeds.boost, travel: speeds.travel, charge: speeds.travelCharge };
		});
	});

	protected readonly engineColumns: GridColumn<EngineRow>[] = [
		{ key: 'engine.name', caption: $localize`Engine` },
		{ key: 'speed', caption: $localize`Speed (m/s)`, type: 'number' },
		{ key: 'boost', caption: $localize`Boost (m/s)`, type: 'number' },
		{ key: 'travel', caption: $localize`Travel (m/s)`, type: 'number' },
		{ key: 'charge', caption: $localize`Travel charge (s)`, type: 'number', format: { maximumFractionDigits: 1 } },
		{ key: 'engine.price.avg', caption: $localize`Price (each)`, type: 'number' },
	];
	protected readonly trackEngine = (row: EngineRow) => row.engine.id;

	protected readonly getSlotsStr = getSlotsStr;

	protected cargoTypes(cargo: ShipCargo) {
		return cargo.types.map((x) => enumLabel(x.name)).join(', ');
	}

	protected openEngine(row: EngineRow) {
		this.router.navigate(['/equipment', row.engine.id]);
	}

	protected compare() {
		this.router.navigate(['/ships/compare'], { queryParams: { ships: addToComparison(this.id()) } });
	}
}
