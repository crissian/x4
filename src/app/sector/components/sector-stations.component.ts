import { Component, Injector, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LazyValue } from '../../core/lazy-value';
import type { SaveMap, SaveStation } from '../../savegame/map/save-map-model';
import { StationNamer } from '../../savegame/map/station-name';
import { SavegameStore } from '../../savegame/savegame-store';
import { STATION_TYPES, StationTypeInfo } from '../../shared/services/constants';
import { FactionService } from '../../shared/services/faction.service';
import type { Faction, GodStation } from '../../shared/services/model/model';

export interface SectorStationRow {
	id: string;
	name: string;
	type: StationTypeInfo;
	player: boolean;
	wreck: boolean;
	known: boolean;
}

export interface SectorStationGroup {
	owner: string;
	faction: Faction | undefined;
	stations: SectorStationRow[];
}

/**
 * The stations of a sector grouped by owner: those of the active save when it has map data, else the
 * stations the game creates at the start. The naming tables and game start stations load lazily.
 */
@Component({
	selector: 'app-sector-stations',
	imports: [RouterLink],
	templateUrl: './sector-stations.component.html',
})
export class SectorStationsComponent {
	readonly sector = input.required<string>();

	private readonly save = inject(SavegameStore);
	private readonly factions = inject(FactionService);
	private readonly injector = inject(Injector);

	private readonly saveMap = computed(() => this.save.active()?.data?.['map'] as SaveMap | undefined);
	private readonly namer = new LazyValue(
		() => !!this.saveMap(),
		async () => {
			const { SiteNamingTables } = await import('../../map/save/site-naming-tables');
			return new StationNamer(this.injector.get(SiteNamingTables));
		}
	);
	private readonly godStations = new LazyValue(
		() => !this.saveMap(),
		async () => (await import('../../shared/services/data/god-stations-data')).GodStations as GodStation[]
	);

	/** The list comes from the active save. */
	readonly fromSave = computed(() => !!this.saveMap());
	/** Owner groups (by faction name, the player first), or null while loading. */
	readonly groups = computed<SectorStationGroup[] | null>(() => {
		const rows = this.fromSave() ? this.saveRows() : this.gameStartRows();
		return rows && this.group(rows);
	});

	private saveRows(): (SectorStationRow & { owner: string })[] | null {
		const namer = this.namer.value();
		if (!namer) {
			return null;
		}
		const sector = this.sector();
		return (this.saveMap()?.stations ?? [])
			.filter((x) => x.sector === sector)
			.map((x: SaveStation) => ({
				id: x.code,
				owner: x.owner,
				name: namer.name(x),
				type: SectorStationsComponent.typeInfo(namer.type(x)),
				player: x.owner === 'player',
				wreck: x.state === 'wreck',
				known: x.known,
			}));
	}

	private gameStartRows(): (SectorStationRow & { owner: string })[] | null {
		const stations = this.godStations.value();
		if (!stations) {
			return null;
		}
		const sector = this.sector();
		return stations
			.filter((x) => x.sector === sector)
			.map((x) => {
				const type = SectorStationsComponent.typeInfo(x.type);
				const short = this.factions.getEntity(x.owner ?? '')?.shortName;
				return {
					id: x.id,
					owner: x.owner ?? '',
					name: [short, type.label].filter(Boolean).join(' '),
					type,
					player: false,
					wreck: false,
					known: true,
				};
			});
	}

	private group(rows: (SectorStationRow & { owner: string })[]): SectorStationGroup[] {
		const groups = new Map<string, SectorStationGroup>();
		for (const row of rows) {
			const group = groups.get(row.owner) ?? {
				owner: row.owner,
				// The game data has a "player" faction; the player's group gets its own heading instead.
				faction: row.owner === 'player' ? undefined : this.factions.getEntity(row.owner),
				stations: [],
			};
			group.stations.push(row);
			groups.set(row.owner, group);
		}
		const result = [...groups.values()];
		for (const group of result) {
			group.stations.sort((a, b) => a.type.label.localeCompare(b.type.label) || a.name.localeCompare(b.name));
		}
		const rank = (x: SectorStationGroup) => (x.owner === 'player' ? 0 : 1);
		return result.sort(
			(a, b) => rank(a) - rank(b) || (a.faction?.name ?? a.owner).localeCompare(b.faction?.name ?? b.owner)
		);
	}

	private static typeInfo(id: string): StationTypeInfo {
		return STATION_TYPES.find((x) => x.id === id) ?? STATION_TYPES[STATION_TYPES.length - 1];
	}
}
