import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { disabled, form, min } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { QueryParamSync } from '../core/router/query-param-sync';
import { Economy } from '../economy/economy';
import type { EconomyScope } from '../economy/economy-model';
import { WareClasses } from '../economy/ware-classes';
import { SaveStationNames } from '../map/save/save-station-names';
import { ActiveSave } from '../savegame/active-save';
import type { SaveStation } from '../savegame/map/save-map-model';
import { FactionService } from '../shared/services/faction.service';
import { FilterLookups } from '../shared/services/filter-lookups';
import { ModuleService } from '../shared/services/module.service';
import { SectorService } from '../shared/services/universe.service';
import type { WareGroup } from '../shared/services/model/model';
import { WareService } from '../shared/services/ware.service';
import type { SupplyDemandRow } from './supply-demand-model';
import { SupplyDemandLookups, SupplyDemandModel, SupplyDemandQuery } from './supply-demand-query';

/**
 * State of the supply and demand page: the filters (a signal form kept in the URL query params), the economy of
 * the active save, the table rows and the selected ware. Provided by the page.
 */
@Injectable()
export class SupplyDemandStore {
	static readonly DEFAULTS = SupplyDemandQuery.DEFAULTS;

	private readonly activeSave = inject(ActiveSave);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly sectorService = inject(SectorService);
	private readonly wareService = inject(WareService);
	private readonly moduleService = inject(ModuleService);
	private readonly factionService = inject(FactionService);
	private readonly stationNames = inject(SaveStationNames);

	readonly save = this.activeSave.save;
	readonly saveMap = this.activeSave.map;
	readonly status = this.activeSave.status;
	readonly gameTime = this.activeSave.gameTime;
	/** The sectors of the save, by name. */
	readonly sectors = this.activeSave.sectors;
	/** The factions that own stations in the save, by name. */
	readonly factions = computed(() => {
		const owners = new Set((this.saveMap()?.stations ?? []).map((x) => x.owner));
		owners.delete('player');
		return [...owners]
			.map((id) => ({ id, name: this.factionService.getEntity(id)?.name ?? id }))
			.sort((a, b) => a.name.localeCompare(b.name));
	});

	/** The economy of the save; its station flows are worked out once per save. */
	readonly economy = computed(() => {
		const map = this.saveMap();
		return map
			? new Economy(
					map,
					this.wareService,
					this.moduleService,
					this.sectorService.getEntities(),
					WareClasses.GAME_BUILDING
				)
			: undefined;
	});
	/** The ware groups of the wares in the save, in the order of the ware lists. */
	readonly groups = computed(() => {
		const seen = new Map<string, WareGroup>();
		for (const row of this.economy()?.rows() ?? []) {
			const group = this.wareService.getEntity(row.ware)?.group;
			if (group) {
				seen.set(group.id, group);
			}
		}
		return [...seen.values()].sort((a, b) => this.wareService.compareGroups(a, b));
	});

	private readonly lookups: SupplyDemandLookups = {
		...new FilterLookups(this.sectorService, this.wareService),
		faction: (id) => !!id && !!this.factionService.getEntity(id),
	};

	readonly model = signal<SupplyDemandModel>(
		SupplyDemandQuery.read(this.activatedRoute.snapshot.queryParamMap, this.lookups)
	);
	readonly form = form(this.model, (x) => {
		min(x.jumps, SupplyDemandQuery.RANGES.jumps.min);
		disabled(x.faction, ({ valueOf }) => valueOf(x.scope) !== 'faction');
		disabled(x.sector, ({ valueOf }) => valueOf(x.scope) !== 'sector');
		// the jumps are the area around the sector and the reach of the map
		disabled(x.jumps, ({ valueOf }) => valueOf(x.scope) !== 'sector' && valueOf(x.map) !== 'reach');
	});
	/** The model with out of range numbers back at their defaults. */
	private readonly filterModel = computed(() => SupplyDemandQuery.clean(this.model()));
	private readonly selectedKey = signal(this.wareParam(this.activatedRoute.snapshot.queryParamMap.get('ware')));

	/** The sector the sector scope is around, undefined for another scope or an unknown name. */
	readonly centre = computed(() => {
		const model = this.filterModel();
		return model.scope === 'sector' ? this.lookups.sectorId(model.sector) : undefined;
	});
	/** local: the map colours each sector by its own stations; reach: by those within the jumps around it. */
	readonly mapMode = computed(() => this.filterModel().map);
	/** Jumps around the centre. */
	readonly jumps = computed(() => this.filterModel().jumps);
	/** What the jumps affect now, for the tooltip of their input. */
	readonly jumpsHint = computed(() => {
		const { scope, map } = this.filterModel();
		if (scope === 'sector') {
			return map === 'reach'
				? $localize`Area around the sector and reach of the map`
				: $localize`Area around the sector`;
		}
		return map === 'reach' ? $localize`Reach of the map` : $localize`Used with a sector scope or the Reach map`;
	});
	/** Kept while the values stay the same, so a keystroke that changes nothing doesn't count again. */
	readonly scope = computed<EconomyScope>(
		() => {
			const model = this.filterModel();
			const centre = this.centre();
			return {
				faction: model.scope === 'faction' && model.faction ? model.faction : undefined,
				centre,
				jumps: centre ? model.jumps : undefined,
				includePlayer: model.player,
			};
		},
		{ equal: SupplyDemandStore.sameScope }
	);

	/** The wares of the scope, the biggest shortfall first. */
	readonly rows = computed<SupplyDemandRow[]>(() => {
		const { group, mined } = this.filterModel();
		return (this.economy()?.rows(this.scope()) ?? [])
			.filter((x) => (mined || !x.mined) && (!group || this.wareService.getEntity(x.ware)?.group?.id === group))
			.map((x) => {
				const ware = this.wareService.getEntity(x.ware);
				return { ...x, name: ware?.name ?? x.ware, group: ware?.group?.id ?? '' };
			})
			.sort((a, b) => a.value - b.value || a.name.localeCompare(b.name));
	});
	/** The ware named in the URL, else the first row. */
	readonly selected = computed<SupplyDemandRow | undefined>(() =>
		QueryParamSync.pick(this.rows(), this.selectedKey(), (x) => x.ware)
	);
	/** The id of the selected ware, for the map and the detail panel. */
	readonly selectedWare = computed(() => this.selected()?.ware);

	constructor() {
		// a faction from the URL that owns no station in the save can't be picked in the form: drop it
		effect(() => {
			const { faction } = this.model();
			if (faction && this.saveMap() && !this.factions().some((x) => x.id === faction)) {
				untracked(() => this.model.update((x) => ({ ...x, faction: '' })));
			}
		});
		// the filters and the selection are kept in the URL
		QueryParamSync.connect(
			computed(() => ({ model: this.filterModel(), ware: this.selectedKey() })),
			{
				read: (params) => ({
					model: SupplyDemandQuery.read(params, this.lookups),
					ware: this.wareParam(params.get('ware')),
				}),
				write: ({ model, ware }) => ({ ...SupplyDemandQuery.write(model, this.lookups), ware: ware || null }),
			},
			({ model, ware }) => {
				this.model.set(model);
				this.selectedKey.set(ware);
			}
		);
	}

	/** The ware id from the URL, empty when unknown. */
	private wareParam(id: string | null): string {
		return id && this.wareService.getEntity(id) ? id : '';
	}

	private static sameScope(a: EconomyScope, b: EconomyScope): boolean {
		return (
			a.faction === b.faction &&
			a.centre === b.centre &&
			a.jumps === b.jumps &&
			a.includePlayer === b.includePlayer
		);
	}

	select(row: SupplyDemandRow): void {
		this.selectedKey.set(row.ware);
	}

	/** Sets the sector scope around a sector, as a click on the map does. */
	setCentre(sectorId: string): void {
		const name = this.sectorService.getEntity(sectorId)?.name;
		if (name) {
			this.model.update((x) => ({ ...x, scope: 'sector', sector: name }));
		}
	}

	/** The station name and its owner's short name; the code until the naming tables load. */
	stationName(station: SaveStation): string {
		return this.stationNames.label(station);
	}

	sectorName(id: string): string {
		return this.sectorService.getEntity(id)?.name ?? id;
	}
}
