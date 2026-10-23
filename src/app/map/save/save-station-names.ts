import { Injectable, Injector, Signal, inject } from '@angular/core';
import { GameText } from '../../core/game-text';
import { LazyValue } from '../../core/lazy-value';
import { ActiveSave } from '../../savegame/active-save';
import type { SaveStation } from '../../savegame/map/save-map-model';
import { StationNamer } from '../../savegame/map/station-name';
import { FactionService } from '../../shared/services/faction.service';
import type { GodStation } from '../../shared/services/model/model';
import { StationTypes } from '../../shared/services/station-types';

/**
 * Names the stations of the active save and of the game start. The naming tables and the game start stations
 * load in their own chunks, each once, only when needed.
 */
@Injectable({ providedIn: 'root' })
export class SaveStationNames {
	private readonly activeSave = inject(ActiveSave);
	private readonly factions = inject(FactionService);
	private readonly injector = inject(Injector);
	private namerLoad: Promise<StationNamer> | undefined;
	private godStationsLoad: Promise<GodStation[]> | undefined;

	/** The namer of save stations; undefined until loaded, which starts once a save with map data is active. */
	readonly namer: Signal<StationNamer | undefined> = new LazyValue(
		() => !!this.activeSave.map(),
		() => this.loadNamer()
	).value;

	/** Loads the namer of save stations (once). */
	loadNamer(): Promise<StationNamer> {
		this.namerLoad ??= GameText.withTexts(
			['game-texts', 'station-macros'],
			() => import('./site-naming-tables')
		).then(({ SiteNamingTables }) => new StationNamer(this.injector.get(SiteNamingTables)));
		return this.namerLoad;
	}

	/**
	 * The stations the game creates at the start, loaded (once) when `when` first gives true; undefined until then.
	 * Call in an injection context.
	 */
	godStations(when: () => boolean): Signal<GodStation[] | undefined> {
		return new LazyValue(when, () => this.loadGodStations()).value;
	}

	/** The station name and its owner's short name; the code until the naming tables load. */
	label(station: SaveStation): string {
		const name = this.namer()?.name(station) ?? station.code;
		const owner = this.ownerShort(station.owner);
		return owner && !name.startsWith(`${owner} `) ? `${name} (${owner})` : name;
	}

	/** The short name of a station owner; undefined for the player or an unknown faction. */
	ownerShort(owner: string): string | undefined {
		return owner === 'player' ? undefined : this.factions.getEntity(owner)?.shortName;
	}

	/** The name of a game start station: its owner's short name and its type. */
	gameStart(owner: string | undefined, type: string): string {
		return [owner && this.factions.getEntity(owner)?.shortName, StationTypes.info(type).label]
			.filter(Boolean)
			.join(' ');
	}

	private loadGodStations(): Promise<GodStation[]> {
		this.godStationsLoad ??= import('../../shared/services/data/god-stations-data').then(
			({ GodStations }) => GodStations as GodStation[]
		);
		return this.godStationsLoad;
	}
}
