import { Component, ElementRef, computed, inject, input, model, viewChild, viewChildren } from '@angular/core';
import { SaveStationNames } from '../../map/save/save-station-names';
import { StationTypeBadgeComponent } from '../../map/station-type-badge.component';
import { ActiveSave } from '../../savegame/active-save';
import type { SaveStation } from '../../savegame/map/save-map-model';
import { ShowOnMapLinkComponent } from '../../shared/components/show-on-map-link.component';
import type { StationTypeInfo } from '../../shared/services/constants';
import { FactionService } from '../../shared/services/faction.service';
import { StationTypes } from '../../shared/services/station-types';
import { WareService } from '../../shared/services/ware.service';
import type { Faction } from '../../shared/services/model/model';
import { SectorStationDetailsComponent } from './sector-station-details.component';
import { FactionLabelComponent } from '../../shared/components/faction-label.component';

export interface SectorStationRow {
	id: string;
	owner: string;
	name: string;
	type: StationTypeInfo;
	player: boolean;
	wreck: boolean;
	known: boolean;
	/** name of the ware a save factory produces */
	product?: string;
	/** ware id of `product` when the site data has the ware */
	productLink?: string;
	/** the save station, whose offers and modules the panel shows */
	save?: SaveStation;
}

export interface SectorStationGroup {
	owner: string;
	faction: Faction | undefined;
	stations: SectorStationRow[];
}

/**
 * The stations of a sector grouped by owner: those of the active save when it has map data, else the
 * stations the game creates at the start, as a list with a panel for the selected station. The naming tables and
 * game start stations load lazily.
 */
@Component({
	selector: 'app-sector-stations',
	imports: [FactionLabelComponent, SectorStationDetailsComponent, ShowOnMapLinkComponent, StationTypeBadgeComponent],
	templateUrl: './sector-stations.component.html',
	styleUrl: './sector-stations.component.css',
})
export class SectorStationsComponent {
	readonly sector = input.required<string>();
	/** Code (or game start id) of the selected station; the first station when unset or unknown. */
	readonly selected = model<string>();

	private readonly factions = inject(FactionService);
	private readonly stationNames = inject(SaveStationNames);
	private readonly wares = inject(WareService);
	private readonly rowButtons = viewChildren<ElementRef<HTMLButtonElement>>('row');
	private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

	private readonly saveMap = inject(ActiveSave).map;
	private readonly godStations = this.stationNames.godStations(() => !this.saveMap());

	/** The list comes from the active save. */
	readonly fromSave = computed(() => !!this.saveMap());
	/** Owner groups (by faction name, the player first), or null while loading. */
	readonly groups = computed<SectorStationGroup[] | null>(() => {
		const rows = this.fromSave() ? this.saveRows() : this.gameStartRows();
		return rows && this.group(rows);
	});
	/** The rows in list order. */
	readonly rows = computed(() => this.groups()?.flatMap((x) => x.stations) ?? []);
	/** The selected station's row: the first one unless the selection names another. */
	readonly current = computed(() => {
		const rows = this.rows();
		return rows.find((x) => x.id === this.selected()) ?? rows[0];
	});

	private saveRows(): SectorStationRow[] | null {
		const namer = this.stationNames.namer();
		if (!namer) {
			return null;
		}
		const sector = this.sector();
		return (this.saveMap()?.stations ?? [])
			.filter((x) => x.sector === sector)
			.map((x: SaveStation) => ({
				id: x.code,
				owner: x.owner,
				...this.product(x),
				name: namer.name(x),
				type: StationTypes.info(namer.type(x)),
				player: x.owner === 'player',
				wreck: x.state === 'wreck',
				known: x.known,
				save: x,
			}));
	}

	/** Selects a row; on narrow screens, where the panel sits under the list, scrolls the panel into view. */
	select(id: string): void {
		this.selected.set(id);
		if (globalThis.matchMedia?.('(max-width: 1023px)').matches) {
			this.panel()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	/** Arrow keys, Home and End move the selection between the rows and focus the selected one. */
	protected keydown(event: KeyboardEvent): void {
		const rows = this.rows();
		const index = rows.indexOf(this.current());
		const target = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: rows.length - 1 }[event.key];
		if (target == null || target < 0 || target >= rows.length) {
			return;
		}
		event.preventDefault();
		this.selected.set(rows[target].id);
		this.rowButtons()[target]?.nativeElement.focus();
	}

	private product(x: SaveStation): Pick<SectorStationRow, 'product' | 'productLink'> {
		const ware = x.product ? this.wares.getEntity(x.product) : undefined;
		return x.product ? { product: ware?.name ?? x.product, productLink: ware?.id } : {};
	}

	private gameStartRows(): SectorStationRow[] | null {
		const stations = this.godStations();
		if (!stations) {
			return null;
		}
		const sector = this.sector();
		return stations
			.filter((x) => x.sector === sector)
			.map((x) => ({
				id: x.id,
				owner: x.owner ?? '',
				name: this.stationNames.gameStart(x.owner, x.type),
				type: StationTypes.info(x.type),
				player: false,
				wreck: false,
				known: true,
			}));
	}

	private group(rows: SectorStationRow[]): SectorStationGroup[] {
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
}
