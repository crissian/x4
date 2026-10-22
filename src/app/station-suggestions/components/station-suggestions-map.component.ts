import { Component, computed, inject } from '@angular/core';
import { PlacementRanking } from '../../economy/placement-ranking';
import { HeatMapMarker, MarkedHeatMapComponent } from '../../map/heat-map/marked-heat-map.component';
import { SupplyDemandDetail } from '../../supply-demand/supply-demand-detail';
import { StationSuggestionsStore } from '../station-suggestions-store';

/**
 * The galaxy map of the picked row's ware: each sector shaded by its Cr/h for that ware on its own (no shared
 * demand), dark where no factory fits, with a numbered ★ on the top spots: those of the list (where to build) or of
 * the map (what to build here, which also outlines the reach). A click shows what to build in the clicked sector.
 */
@Component({
	selector: 'app-station-suggestions-map',
	imports: [MarkedHeatMapComponent],
	templateUrl: './station-suggestions-map.component.html',
})
export class StationSuggestionsMapComponent {
	/** Top spots marked on the map. */
	static readonly STARS = 5;

	protected readonly store = inject(StationSuggestionsStore);
	protected readonly ware = computed(() => this.store.selected()?.ware);
	protected readonly wareName = computed(() => this.store.wareName(this.ware() ?? ''));

	private readonly spots = computed(() => {
		const context = this.store.context();
		const ware = this.ware();
		return context && ware ? PlacementRanking.spots(context, ware, this.store.options()) : undefined;
	});
	protected readonly values = computed(() => {
		const spots = this.spots();
		const context = this.store.context();
		return spots && context
			? new Map(context.sectors().map((id) => [id, spots.get(id)?.crPerHour ?? 0]))
			: undefined;
	});
	protected readonly idle = computed(
		() => new Set([...(this.values() ?? [])].filter(([, x]) => !x).map(([id]) => id))
	);
	/** The top spots, best first: of the list for the ware, or of the map in what to build here. */
	private readonly stars = computed(() => {
		const { STARS } = StationSuggestionsMapComponent;
		if (this.store.here()) {
			return [...(this.spots()?.values() ?? [])]
				.sort(PlacementRanking.compare)
				.slice(0, STARS)
				.map((x) => x.sector);
		}
		const ware = this.ware();
		return this.store
			.rows()
			.filter((x) => x.ware === ware)
			.slice(0, STARS)
			.map((x) => x.sector);
	});
	protected readonly markers = computed<HeatMapMarker[]>(() =>
		this.stars().map((sector, i) => ({ sector, label: String(i + 1) }))
	);
	/** The reach of the sector in what to build here; no area otherwise. */
	protected readonly outline = computed(() => {
		const centre = this.store.centre();
		return new Set(centre ? (this.store.context()?.economy.graph.within(centre, this.store.jumps()) ?? []) : []);
	});
	protected readonly centre = computed(() => this.store.centre() ?? this.store.selected()?.sector);

	protected readonly format = (id: string, name: string) => {
		const spot = this.spots()?.get(id);
		const rank = this.stars().indexOf(id);
		const star = rank < 0 ? '' : ` · ★ ${$localize`top spot ${rank + 1}:rank:`}`;
		if (!spot) {
			return $localize`${name}:name:: no room for a factory` + star;
		}
		const value = SupplyDemandDetail.compact(spot.crPerHour).replace(/^\+/, '');
		return $localize`${name}:name:: ${value}:value: Cr/h · modules: ~${spot.modules}:modules:` + star;
	};

	protected pick(sectorId: string) {
		this.store.showSector(sectorId);
	}
}
