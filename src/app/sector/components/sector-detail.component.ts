import { DecimalPipe, PercentPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { RouterLink } from '@angular/router';
import { LucideMapPinned, LucideCircleDot, LucideChevronsRight, LucideRoute } from '@lucide/angular';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { FactionService } from '../../shared/services/faction.service';
import { Planet, SectorResource } from '../../shared/services/model/model';
import { GAME_VERSIONS } from '../../shared/services/constants';
import { ClusterService, SectorService } from '../../shared/services/universe.service';
import { WareService } from '../../shared/services/ware.service';

type PlanetRow = Planet & { moon?: boolean };

@Component({
	imports: [DetailPageComponent, DetailComponent, RouterLink, DataGridComponent, DecimalPipe, PercentPipe, LucideMapPinned, LucideCircleDot, LucideChevronsRight, LucideRoute],
	templateUrl: './sector-detail.component.html',
})
export class SectorDetailComponent {
	private readonly sectors = inject(SectorService);
	private readonly clusters = inject(ClusterService);
	private readonly factions = inject(FactionService);
	private readonly wares = inject(WareService);

	readonly id = input.required<string>();

	protected readonly versions = GAME_VERSIONS;
	protected readonly jumpGate = $localize`jump gate`;
	protected readonly accelerator = $localize`accelerator`;
	protected readonly trackRow = (row: unknown) => row;

	protected readonly entity = computed(() => this.sectors.getEntity(this.id()));
	protected readonly cluster = computed(() => this.clusters.getEntity(this.entity()?.cluster ?? ''));
	protected readonly owner = computed(() => this.factions.getEntity(this.entity()?.owner ?? ''));

	protected readonly gates = computed(() =>
		(this.entity()?.gates ?? []).flatMap((x) => {
			const sector = this.sectors.getEntity(x.sector);
			return sector ? [{ type: x.type, sector }] : [];
		})
	);
	protected readonly highways = computed(() =>
		(this.entity()?.highways ?? []).flatMap((x) => this.sectors.getEntity(x) ?? [])
	);
	protected readonly neighbours = computed(() =>
		(this.cluster()?.sectors ?? []).filter((x) => x !== this.id()).flatMap((x) => this.sectors.getEntity(x) ?? [])
	);

	/** Planets followed by their moons. */
	protected readonly planets = computed(() => {
		const result: PlanetRow[] = [];
		for (const planet of this.cluster()?.planets ?? []) {
			result.push(planet);
			result.push(...(planet.moons ?? []).map((x) => ({ ...x, moon: true })));
		}
		return result;
	});

	/** Total amount the sector holds per ware. */
	protected readonly totals = computed(() => {
		const totals = new Map<string, number>();
		for (const r of this.entity()?.resources ?? []) {
			totals.set(r.ware, (totals.get(r.ware) ?? 0) + r.count * r.yieldAmount);
		}
		return [...totals].map(([id, amount]) => ({ id, ware: this.wares.getEntity(id), amount }));
	});

	protected readonly resourceColumns: GridColumn<SectorResource>[] = [
		{ key: 'ware', caption: $localize`Ware`, value: (x) => this.wares.getEntity(x.ware)?.name ?? x.ware },
		{ key: 'count', caption: $localize`Areas`, type: 'number' },
		{ key: 'size', caption: $localize`Size` },
		{ key: 'radius', caption: $localize`Radius (km)`, type: 'number', value: (x) => x.radius / 1000 },
		{ key: 'yield', caption: $localize`Yield` },
		{ key: 'yieldAmount', caption: $localize`Amount per area`, type: 'number' },
		{ key: 'speed', caption: $localize`Gather speed` },
		{ key: 'respawnDelay', caption: $localize`Respawn (min)`, type: 'number' },
	];

	protected readonly planetColumns: GridColumn<PlanetRow>[] = [
		{ key: 'name', caption: $localize`Name`, display: (x) => (x.moon ? '↳ ' : '') + (x.name ?? '-') },
		{ key: 'class', caption: $localize`Class` },
		{ key: 'geology', caption: $localize`Geology` },
		{ key: 'atmosphere', caption: $localize`Atmosphere` },
		{ key: 'population', caption: $localize`Population` },
		{ key: 'settlements', caption: $localize`Settlements` },
	];
}
