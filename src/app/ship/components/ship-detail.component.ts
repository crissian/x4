import { Descriptions } from '../../shared/services/descriptions';
import { DecimalPipe } from '@angular/common';
import { EnumLabelPipe, EnumLabels } from '../../core/enum-labels';
import { Component, computed, inject } from '@angular/core';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { Router, RouterLink } from '@angular/router';
import { LucideGitCompareArrows, LucideWrench } from '@lucide/angular';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { ProducibleDetailPage } from '../../shared/components/entity-detail-page';
import { EntityLinkComponent } from '../../shared/components/entity-link.component';
import { ProductionCardsComponent } from '../../shared/components/production-cards.component';
import { RowNavigation } from '../../shared/components/row-navigation';
import { PriceRangePipe } from '../../core/format/price-range.pipe';
import { SellersComponent } from '../../shared/components/sellers.component';
import { ShipPerformance } from '../../shared/services/ship-performance';
import { Equipment, Ship, ShipCargo } from '../../shared/services/model/model';
import { Production } from '../../shared/services/production';
import { ShipStatsService } from '../../shared/services/ship-stats.service';
import { ShipService } from '../../shared/services/ship.service';
import { ShipSellersNearComponent } from '../sellers/ship-sellers-near.component';
import { ShipCompareComponent } from './ship-compare.component';

interface EngineRow {
	engine: Equipment;
	speed: number;
	boost: number;
	travel: number;
	charge: number;
}

@Component({
	imports: [
		DetailPageComponent,
		DetailComponent,
		DecimalPipe,
		RouterLink,
		EntityLinkComponent,
		ProductionCardsComponent,
		SellersComponent,
		ShipSellersNearComponent,
		DataGridComponent,
		LucideWrench,
		LucideGitCompareArrows,
		EnumLabelPipe,
		PriceRangePipe,
	],
	templateUrl: './ship-detail.component.html',
})
export class ShipDetailComponent extends ProducibleDetailPage<Ship> {
	protected readonly service = inject(ShipService);
	protected readonly description = Descriptions.of('ships', this.id);
	private readonly stats = inject(ShipStatsService);
	private readonly router = inject(Router);

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
			const speeds = ShipPerformance.flightSpeeds(ship, engine);
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

	protected readonly getSlotsStr = Production.getSlotsStr;

	protected cargoTypes(cargo: ShipCargo) {
		return cargo.types.map((x) => EnumLabels.label(x.name)).join(', ');
	}

	protected readonly openEngine = RowNavigation.to<EngineRow>('/equipment', (x) => x.engine.id);

	protected compare() {
		this.router.navigate(['/ships/compare'], { queryParams: { ships: ShipCompareComponent.addToComparison(this.id()) } });
	}
}
