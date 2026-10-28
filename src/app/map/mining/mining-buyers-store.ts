import { Injectable, computed, inject, linkedSignal, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { LazyValue } from '../../core/lazy-value';
import type { StationFlowCalculator } from '../../economy/station-flow-calculator';
import { ActiveSave } from '../../savegame/active-save';
import type { SaveStation } from '../../savegame/map/save-map-model';
import { ModuleService } from '../../shared/services/module.service';
import { SectorService } from '../../shared/services/universe.service';
import { WareService } from '../../shared/services/ware.service';
import { TravelCache } from '../../trade/travel-cache';
import { MapStore } from '../map-store';
import { Mining } from '../mining';
import { RoutePlanner } from '../route-planner';
import { MapSaveLayer } from '../save/map-save-layer';
import { SaveStationNames } from '../save/save-station-names';
import { MinersEstimate, MinersNeeded } from './miners-needed';
import type { MiningBuyers, MiningPair } from './mining-buyers';

/** A pair with the names it shows. */
export interface MiningBuyerRow {
	pair: MiningPair;
	/** the buyer's station code */
	key: string;
	name: string;
	/** the owner's short name; undefined for the player */
	owner?: string;
	sectorName: string;
	buyerSectorName: string;
}

/** The ranking code and the station flows load in their own chunk, only once a save has map data. */
interface MiningBuyersTools {
	buyers: typeof MiningBuyers;
	flows: StationFlowCalculator;
}

/**
 * The Mining tab with a save: the stations buying the resource, ranked per mining sector by credits per hour, and
 * the miners the selected buyer needs. Provided by the mining panel.
 */
@Injectable()
export class MiningBuyersStore {
	static readonly MAX_ROWS = 25;
	static readonly MAX_BUYERS = 5;

	private readonly map = inject(MapStore);
	private readonly layer = inject(MapSaveLayer);
	private readonly activeSave = inject(ActiveSave);
	private readonly wares = inject(WareService);
	private readonly modules = inject(ModuleService);
	private readonly sectorService = inject(SectorService);
	private readonly stationNames = inject(SaveStationNames);

	private readonly saveMap = this.activeSave.map;
	private readonly relations = this.activeSave.relations;
	private readonly tools = new LazyValue(
		() => !!this.saveMap(),
		async () => {
			const [{ MiningBuyers }, { StationFlowCalculator }] = await Promise.all([
				import('./mining-buyers'),
				import('../../economy/station-flow-calculator'),
			]);
			return {
				buyers: MiningBuyers,
				flows: new StationFlowCalculator(this.wares, this.modules, this.sectorService.getEntities()),
			} satisfies MiningBuyersTools;
		}
	);

	/** A save with map data is active and the ranking code is loaded; else the panel shows static prices. */
	readonly active = computed(() => this.map.saveActive() && !!this.tools.value() && !!this.saveMap());
	readonly gameTime = this.activeSave.gameTime;

	/** The save's sectors. */
	private readonly sectors = computed(() => {
		const ids = this.layer.sectorIds();
		return ids ? this.map.sectorList.filter((x) => ids.has(x.id)) : [];
	});
	/** The miner's speed and fastest drive charge, the same as the mining panel's. */
	private readonly travelOptions = computed(() => this.map.minerTravelOptions() ?? RoutePlanner.DEFAULT_OPTIONS);
	private readonly cache = computed(() => new TravelCache(this.sectors(), this.travelOptions()));

	/** Station names come from the map layer, which names every placed station. */
	private readonly names = computed(() => new Map(this.layer.stations().map((x) => [x.station, x.name])));

	/** Every reachable mining sector -> buyer pair, best first. */
	private readonly pairs = computed<MiningPair[]>(() => {
		const tools = this.tools.value();
		const map = this.saveMap();
		const ware = this.map.miningWare();
		const miner = this.map.miner();
		if (!tools || !map || !ware || !miner || !this.active()) {
			return [];
		}
		const ids = this.layer.sectorIds();
		const sectors = new Map([...this.map.resourceAmounts()].filter(([id]) => ids?.has(id)));
		return tools.buyers.rank(
			{
				stations: map.stations,
				relations: this.relations(),
				ware,
				sectors,
				capacity: this.capacity(),
				fillMinutes: Math.max(1, this.map.miningModel().fillMinutes || Mining.DEFAULT_FILL_MINUTES),
				near: this.map.routeFrom(),
			},
			this.cache()
		);
	});
	/** The best buyer of each mining sector. */
	readonly rows = computed(() => {
		const buyers = this.tools.value()?.buyers;
		return buyers
			? buyers
					.bestPerSector(this.pairs())
					.slice(0, MiningBuyersStore.MAX_ROWS)
					.map((x) => this.row(x))
			: [];
	});

	/** The expanded mining sector. */
	readonly selectedSector = signal<string | undefined>(undefined);
	/** The best buyers of the expanded sector. */
	readonly buyers = computed(() => {
		const sector = this.selectedSector();
		const buyers = this.tools.value()?.buyers;
		return sector && buyers
			? buyers.buyersFor(this.pairs(), sector, MiningBuyersStore.MAX_BUYERS).map((x) => this.row(x))
			: [];
	});
	/** The picked buyer; resets to the best one when the list no longer holds it. */
	readonly buyerModel = linkedSignal<MiningBuyerRow[], { buyer: string }>({
		source: this.buyers,
		computation: (buyers, previous) => {
			const kept = previous && buyers.some((x) => x.key === previous.value.buyer);
			return { buyer: kept ? previous.value.buyer : (buyers[0]?.key ?? '') };
		},
	});
	readonly buyerForm = form(this.buyerModel);
	readonly selectedBuyer = computed(() => this.buyers().find((x) => x.key === this.buyerModel().buyer));

	/** The miners the picked buyer needs; its consumption is worked out for that station only. */
	readonly needed = computed<MinersEstimate | undefined>(() => {
		const pair = this.selectedBuyer()?.pair;
		const flows = this.tools.value()?.flows;
		const ware = this.map.miningWare();
		if (!pair || !flows || !ware) {
			return undefined;
		}
		const consumed = flows.flows(pair.station).find((x) => x.ware === ware.id)?.consumed ?? 0;
		const sector = this.sectorService.getEntity(pair.sector);
		return MinersNeeded.estimate(
			pair.trip,
			consumed,
			pair.wanted,
			this.map.miningUnits(),
			sector ? MinersNeeded.regrowth(sector, ware.id) : undefined
		);
	});

	/** Expands a mining sector, or collapses it when it is already expanded. */
	toggle(sector: string): void {
		this.selectedSector.update((x) => (x === sector ? undefined : sector));
	}

	private capacity(): number {
		const ware = this.map.miningWare();
		const miner = this.map.miner();
		return ware && miner ? Mining.minerCapacity(miner, ware) : 0;
	}

	private row(pair: MiningPair): MiningBuyerRow {
		const station: SaveStation = pair.station;
		return {
			pair,
			key: station.code,
			name: this.names().get(station) ?? station.code,
			owner: this.stationNames.ownerShort(station.owner),
			sectorName: this.map.sectorName(pair.sector),
			buyerSectorName: this.map.sectorName(station.sector),
		};
	}
}
