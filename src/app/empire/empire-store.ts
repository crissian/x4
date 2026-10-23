import { Injectable, computed, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { EnumLabels } from '../core/enum-labels';
import { GameTextRef } from '../core/game-text-ref';
import { StationFlowCalculator } from '../economy/station-flow-calculator';
import { QueryParamSync } from '../core/router/query-param-sync';
import { SaveStationNames } from '../map/save/save-station-names';
import { ActiveSave } from '../savegame/active-save';
import { FleetAssignments } from '../shared/services/data/fleet-assignments-data';
import { GameTexts } from '../shared/services/data/game-texts-data';
import { ShipOrders } from '../shared/services/data/ship-orders-data';
import { ModuleService } from '../shared/services/module.service';
import { ShipListService } from '../shared/services/ship-list.service';
import { SectorService } from '../shared/services/universe.service';
import { WareService } from '../shared/services/ware.service';
import { EmpireBalance, type EmpireBalanceRow } from './empire-balance';
import type { EmpireShipRow, EmpireStationRow, EmpireSummary } from './empire-model';
import { EmpireModel, EmpireQuery, EmpireTab } from './empire-query';
import { EmpireShips } from './empire-ships';
import { EmpireStations } from './empire-stations';
import { OwnStationLayouts } from './own-station-layout';

/**
 * State of the empire page: the player's ships (in fleet order) and stations of the active save, the summary
 * tiles, the production balance of the stations and the filters (a signal form kept in the URL query params). Provided by the page.
 */
@Injectable()
export class EmpireStore {
	private static readonly ORDERS = new Map(ShipOrders.all.map((x) => [x.id, x.name]));
	private static readonly ASSIGNMENTS = new Map(FleetAssignments.all.map((x) => [x.id, x.name]));

	private readonly activeSave = inject(ActiveSave);
	private readonly models = inject(ShipListService);
	private readonly sectorService = inject(SectorService);
	private readonly modules = inject(ModuleService);
	private readonly wares = inject(WareService);
	private readonly stationNames = inject(SaveStationNames);
	/** the station calculator's production model, with the sector sunlight */
	private readonly flowCalculator = new StationFlowCalculator(
		this.wares,
		this.modules,
		this.sectorService.getEntities()
	);

	readonly save = this.activeSave.save;
	readonly gameTime = this.activeSave.gameTime;
	private readonly empire = this.activeSave.empire;
	private readonly map = this.activeSave.map;
	/** Ready once the save has both the map data (stations) and the empire data (fleets, accounts). */
	readonly status = this.activeSave.statusOf(computed(() => (this.map() && this.empire() ? true : undefined)));

	private readonly initial = EmpireQuery.read(inject(ActivatedRoute).snapshot.queryParamMap);
	readonly tab = signal<EmpireTab>(this.initial.tab);
	readonly model = signal<EmpireModel>(this.initial.model);
	readonly form = form(this.model);

	/** The player's map stations by code, which the station names of the fleets use. */
	private readonly playerStations = computed(() => (this.map()?.stations ?? []).filter((x) => x.owner === 'player'));
	private readonly stationNameById = computed(() => {
		const byCode = new Map(this.playerStations().map((x) => [x.code, x]));
		const namer = this.stationNames.namer();
		return new Map(
			(this.empire()?.stations ?? []).map((own) => {
				const station = byCode.get(own.code);
				return [own.id, station ? (namer?.name(station) ?? station.name ?? own.code) : own.code];
			})
		);
	});

	readonly ships = computed<EmpireShipRow[]>(() =>
		EmpireShips.build(this.empire()?.ships ?? [], {
			model: (id) => this.models.getEntity(id),
			sectorName: (id) => this.sectorName(id),
			text: (ref) => GameTextRef.resolve(ref, GameTexts),
			stationName: (id) => this.stationNameById().get(id),
			orderName: (id) => EmpireStore.ORDERS.get(id),
			assignmentName: (id) => EmpireStore.ASSIGNMENTS.get(id),
		})
	);
	readonly stations = computed<EmpireStationRow[]>(() => {
		const namer = this.stationNames.namer();
		return EmpireStations.build(this.playerStations(), this.empire()?.stations ?? [], this.ships(), {
			sectorName: (id) => this.sectorName(id),
			stationName: (x) => namer?.name(x) ?? x.name ?? x.code,
			products: (id) => this.modules.getEntity(id)?.product?.map((x) => x.id) ?? [],
			wareName: (id) => this.wares.getEntity(id)?.name ?? id,
			layout: (own, workforce) => OwnStationLayouts.of(own, workforce, this.flowCalculator),
		});
	});
	readonly summary = computed<EmpireSummary>(() =>
		EmpireStations.summary(this.save()?.info.money ?? 0, this.ships(), this.stations())
	);

	readonly filteredShips = computed(() => EmpireQuery.ships(this.ships(), this.model()));
	readonly filteredStations = computed(() => EmpireQuery.stations(this.stations(), this.model()));

	/** The stations the production balance counts: those with built modules, but no construction sites. */
	private readonly producing = computed(() => this.stations().filter((x) => x.layout && x.state !== 'construction'));
	/** The hourly flows of each producing station, by station id. */
	private readonly flows = computed(
		() => new Map(this.producing().map((x) => [x.id, this.flowCalculator.flows(x.layout!.flows)]))
	);
	/** The stations the production balance sums up now (the station or sector filter). */
	readonly balanceStations = computed(() => EmpireQuery.balanceStations(this.producing(), this.model()));
	readonly balance = computed<EmpireBalanceRow[]>(() => {
		const flows = this.flows();
		return EmpireBalance.rows(
			this.balanceStations().map((x) => flows.get(x.id) ?? []),
			(id) => this.wares.getEntity(id)?.name ?? id
		);
	});
	readonly filteredBalance = computed(() => EmpireQuery.balance(this.balance(), this.model()));
	/** The producing stations to choose from in the production balance. */
	readonly stationOptions = computed(() => this.producing().map((x) => ({ id: x.id, name: x.name })));

	/** The filter choices: the sectors with a ship or station, the sizes and roles of the ships. */
	readonly sectorOptions = computed(() =>
		EmpireStore.options([...this.ships(), ...this.stations()].map((x) => [x.sector, x.sectorName]))
	);
	readonly sizeOptions = computed(() =>
		EmpireStations.SIZES.filter((size) => this.ships().some((x) => x.size === size)).map((id) => ({
			id,
			name: EnumLabels.label(id),
		}))
	);
	readonly roleOptions = computed(() =>
		EmpireStore.options(this.ships().flatMap((x) => (x.purpose ? [[x.purpose, EnumLabels.label(x.purpose)]] : [])))
	);

	constructor() {
		QueryParamSync.connect(
			computed(() => ({ tab: this.tab(), model: this.model() })),
			{ read: (params) => EmpireQuery.read(params), write: (state) => EmpireQuery.write(state) },
			({ tab, model }) => {
				this.tab.set(tab);
				this.model.set(model);
			}
		);
	}

	private sectorName(id: string): string {
		return this.sectorService.getEntity(id)?.name ?? id;
	}

	/** Distinct `[id, name]` pairs as options, by name. */
	private static options(pairs: readonly (readonly [string, string])[]): { id: string; name: string }[] {
		return [...new Map(pairs).entries()]
			.map(([id, name]) => ({ id, name }))
			.sort((a, b) => a.name.localeCompare(b.name));
	}
}
