import { Component, Injector, computed, inject, input } from '@angular/core';
import { LazyValue } from '../../core/lazy-value';
import type { SaveMap } from '../../savegame/map/save-map-model';
import type { SaveTradeIndex, SaveTradeRow } from '../../savegame/map/save-trade-index';
import { SavegameStore } from '../../savegame/savegame-store';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { FactionService } from '../../shared/services/faction.service';
import { SectorService } from '../../shared/services/universe.service';

/**
 * The known stations of the active save that sell or buy a ware: the "Stations in your save" tab of a ware. The index and the naming tables load in their
 * own chunk, only once a save with map data is active.
 */
@Component({
	selector: 'app-save-ware-trade',
	imports: [DataGridComponent],
	templateUrl: './save-ware-trade.component.html',
})
export class SaveWareTradeComponent {
	readonly ware = input.required<string>();

	private readonly save = inject(SavegameStore);
	private readonly factions = inject(FactionService);
	private readonly sectors = inject(SectorService);
	private readonly injector = inject(Injector);

	private readonly saveMap = computed(() => this.save.active()?.data?.['map'] as SaveMap | undefined);
	private readonly build = new LazyValue(
		() => !!this.saveMap(),
		async () => {
			const [{ SiteNamingTables }, { StationNamer }, { SaveTradeIndex }] = await Promise.all([
				import('../../map/save/site-naming-tables'),
				import('../../savegame/map/station-name'),
				import('../../savegame/map/save-trade-index'),
			]);
			const namer = new StationNamer(this.injector.get(SiteNamingTables));
			const player = $localize`Player`;
			const names = {
				owner: (id: string) => (id === 'player' ? player : (this.factions.getEntity(id)?.name ?? id)),
				sector: (id: string) => this.sectors.getEntity(id)?.name ?? id,
			};
			return (map: SaveMap): SaveTradeIndex => new SaveTradeIndex(map, namer, names);
		}
	);
	private readonly index = computed(() => {
		const build = this.build.value();
		const map = this.saveMap();
		return build && map ? build(map) : undefined;
	});

	/** The sellers, then the buyers of the ware; undefined without an active save (or while it loads). */
	protected readonly lists = computed(() => {
		const trade = this.index()?.forWare(this.ware());
		return (
			trade && [
				{ sell: true, rows: trade.sellers },
				{ sell: false, rows: trade.buyers },
			]
		);
	});

	protected readonly columns: GridColumn<SaveTradeRow>[] = [
		{
			key: 'station',
			caption: $localize`Station`,
			display: (row) => (row.playerOnly ? $localize`${row.station}:station: (player only)` : row.station),
		},
		{ key: 'owner', caption: $localize`Owner` },
		{ key: 'sectorName', caption: $localize`Sector`, link: (row) => ['/sectors', row.sector] },
		{
			key: 'price',
			caption: $localize`Price`,
			type: 'number',
			format: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
		},
		{ key: 'amount', caption: $localize`Amount`, type: 'number' },
	];
	protected readonly trackRow = (row: SaveTradeRow) => row;
}
