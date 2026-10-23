import { Descriptions } from '../../shared/services/descriptions';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { Component, computed, inject, input, viewChild } from '@angular/core';
import { EntityDetailPage } from '../../shared/components/entity-detail-page';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { Router, RouterLink } from '@angular/router';
import { LucideCircleDot, LucideChevronsRight, LucideRoute } from '@lucide/angular';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { TabItem, TabsComponent } from '../../shared/components/tabs/tabs.component';
import { FactionService } from '../../shared/services/faction.service';
import { Planet, Sector, SectorResource } from '../../shared/services/model/model';
import { GAME_VERSIONS } from '../../shared/services/constants';
import { ClusterService, SectorService } from '../../shared/services/universe.service';
import { WareService } from '../../shared/services/ware.service';
import { PlanetPopulation } from '../planet-population';
import { SectorMapComponent } from './sector-map.component';
import { SectorStationsComponent } from './sector-stations.component';
import { FactionLabelComponent } from '../../shared/components/faction-label.component';
import { SectorVaultsComponent } from '../../vaults/sector-vaults.component';
import { ShowOnMapLinkComponent } from '../../shared/components/show-on-map-link.component';

type PlanetRow = Planet & { moon?: boolean };
export type SectorTab = 'stations' | 'connections' | 'resources' | 'system';

@Component({
	imports: [
		DetailPageComponent,
		FactionLabelComponent,
		DetailComponent,
		RouterLink,
		DataGridComponent,
		DecimalPipe,
		PercentPipe,
		ShowOnMapLinkComponent,
		LucideCircleDot,
		LucideChevronsRight,
		LucideRoute,
		SectorMapComponent,
		SectorStationsComponent,
		TabsComponent,
		SectorVaultsComponent,
	],
	templateUrl: './sector-detail.component.html',
})
export class SectorDetailComponent extends EntityDetailPage<Sector> {
	protected readonly service = inject(SectorService);
	protected readonly description = Descriptions.of('sectors', this.id);
	private readonly clusters = inject(ClusterService);
	private readonly factions = inject(FactionService);
	private readonly wares = inject(WareService);
	private readonly router = inject(Router);

	/** The `tab` query parameter: the selected tab, kept in the URL so links can open it. */
	readonly tab = input<string>();
	/** The `station` query parameter: the code of the selected station. */
	readonly station = input<string>();

	private readonly stationList = viewChild(SectorStationsComponent);
	/** Stations in the sector, from the active save or the game start data; null while they load. */
	protected readonly stationCount = computed(() => {
		const groups = this.stationList()?.groups();
		return groups ? groups.reduce((sum, x) => sum + x.stations.length, 0) : null;
	});

	protected readonly tabs = computed(() => {
		const tabs: TabItem<SectorTab>[] = [
			{ id: 'stations', label: $localize`Stations`, count: this.stationCount() ?? undefined },
			{ id: 'connections', label: $localize`Connections` },
			{ id: 'resources', label: $localize`Resources` },
		];
		return this.cluster() ? [...tabs, { id: 'system' as const, label: $localize`System` }] : tabs;
	});
	protected readonly activeTab = computed(() =>
		SectorDetailComponent.pickTab(
			this.tab(),
			this.tabs().map((x) => x.id),
			this.stationCount()
		)
	);

	/**
	 * The tab to show: the one in the URL when the page has it, else Stations when the sector has stations (or
	 * while they load), else Connections.
	 */
	static pickTab(requested: string | undefined, available: readonly SectorTab[], stations: number | null): SectorTab {
		const found = available.find((x) => x === requested);
		if (found) {
			return found;
		}
		return stations === 0 ? 'connections' : 'stations';
	}

	/** Keeps the selected tab or station in the URL, so the page can be shared as it is. */
	protected query(params: { tab?: SectorTab; station?: string }) {
		void this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge', replaceUrl: true });
	}

	protected readonly versions = GAME_VERSIONS;
	protected readonly jumpGate = $localize`jump gate`;
	protected readonly accelerator = $localize`accelerator`;
	protected readonly trackRow = (row: unknown) => row;

	protected readonly cluster = computed(() => this.clusters.getEntity(this.entity()?.cluster ?? ''));
	/** The system's description, unless it is the sector's. */
	protected readonly clusterDescription = Descriptions.of('clusters', () => this.cluster()?.id);
	protected readonly owner = computed(() => this.factions.getEntity(this.entity()?.owner ?? ''));

	protected readonly gates = computed(() =>
		(this.entity()?.gates ?? []).flatMap((x) => {
			const sector = this.service.getEntity(x.sector);
			return sector ? [{ type: x.type, sector }] : [];
		})
	);
	protected readonly highways = computed(() =>
		(this.entity()?.highways ?? []).flatMap((x) => this.service.getEntity(x) ?? [])
	);
	protected readonly neighbours = computed(() =>
		(this.cluster()?.sectors ?? []).filter((x) => x !== this.id()).flatMap((x) => this.service.getEntity(x) ?? [])
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
		{
			key: 'population',
			caption: $localize`Population`,
			display: (x) => PlanetPopulation.label(x),
		},
		{ key: 'settlements', caption: $localize`Settlements` },
	];
}
