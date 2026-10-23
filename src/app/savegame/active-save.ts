import { Injectable, Signal, computed, inject } from '@angular/core';
import { Duration } from '../core/format/duration';
import type { Sector } from '../shared/services/model/model';
import { SectorService } from '../shared/services/universe.service';
import { BlueprintsExtractor } from './extractors/blueprints-extractor';
import { EmpireExtractor } from './extractors/empire-extractor';
import { LicencesExtractor } from './extractors/licences-extractor';
import { LogExtractor } from './extractors/log-extractor';
import { MapExtractor } from './extractors/map-extractor';
import { RelationsExtractor } from './extractors/relations-extractor';
import { ResearchExtractor } from './extractors/research-extractor';
import { RepresentativesExtractor } from './extractors/representatives-extractor';
import { ShipsExtractor } from './extractors/ships-extractor';
import { SaveVaults, VaultsExtractor } from './extractors/vaults-extractor';
import type { SaveBlueprints, SaveLicences, SaveMap, SaveRelations, SaveRepresentatives, SaveResearch, SaveShips } from './map/save-map-model';
import type { SaveLog } from './log/save-log-model';
import type { SaveEmpire } from './empire/save-empire-model';
import { SavegameStore } from './savegame-store';

/**
 * What a page reading a save can show: `none` without an active save, `loading` while its data is read or
 * re-extracted, `reload-needed` when the data is missing and the file must be loaded again, else `ready`.
 */
export type ActiveSaveStatus = 'none' | 'loading' | 'reload-needed' | 'ready';

/** The active save and its extracted data, each undefined without an active save or for a save read before it. */
@Injectable({ providedIn: 'root' })
export class ActiveSave {
	private readonly savegames = inject(SavegameStore);
	private readonly sectorService = inject(SectorService);

	readonly save = this.savegames.active;
	readonly map = this.data<SaveMap>(MapExtractor.KEY);
	readonly relations = this.data<SaveRelations>(RelationsExtractor.KEY);
	readonly licences = this.data<SaveLicences>(LicencesExtractor.KEY);
	readonly blueprints = this.data<SaveBlueprints>(BlueprintsExtractor.KEY);
	readonly representatives = this.data<SaveRepresentatives>(RepresentativesExtractor.KEY);
	/** The research the player has completed; undefined for a save read before it was. */
	readonly research = this.data<SaveResearch>(ResearchExtractor.KEY);
	/** The player's ships; undefined for a save read before they were. */
	readonly ships = this.data<SaveShips>(ShipsExtractor.KEY);
	/** The player's logbook; undefined for a save read before it was. */
	readonly log = this.data<SaveLog>(LogExtractor.KEY);
	/** The data vaults; undefined for a save read before they were. */
	readonly vaults = this.data<SaveVaults>(VaultsExtractor.KEY);
	/** Fleets, station accounts, ownerless ships and hostile ship counts; undefined for a save read before them. */
	readonly empire = this.data<SaveEmpire>(EmpireExtractor.KEY);

	/** Whether the map data can be shown. */
	readonly status = this.statusOf(this.map);
	/** The save has no map data and must be loaded again. */
	readonly outdated = computed(() => this.status() === 'reload-needed');
	/** The play time of the save, as hours and minutes. */
	readonly gameTime = computed(() => Duration.hoursMinutes(this.save()?.info?.gameTime ?? 0));
	/** The sectors of the save, by name; empty without map data. */
	readonly sectors = computed<Sector[]>(() => {
		const ids = new Set((this.map()?.sectors ?? []).map((x) => x.id));
		return this.sectorService
			.getEntities()
			.filter((x) => ids.has(x.id))
			.sort((a, b) => a.name.localeCompare(b.name));
	});

	/** Whether the given data of the active save can be shown. */
	statusOf(data: Signal<unknown>): Signal<ActiveSaveStatus> {
		return computed(() => {
			const save = this.save();
			if (!save) {
				return 'none';
			}
			if (data()) {
				return 'ready';
			}
			return this.savegames.status(save.id) === 'reload-needed' ? 'reload-needed' : 'loading';
		});
	}

	private data<T>(key: string): Signal<T | undefined> {
		return computed(() => this.save()?.data?.[key] as T | undefined);
	}
}
