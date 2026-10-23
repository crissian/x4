import { Component, computed, inject } from '@angular/core';
import { MapStations } from '../map-stations';
import { MapStore } from '../map-store';
import { MapSaveLayer } from '../save/map-save-layer';
import { StationHover } from '../station-marker';
import { MapCountBadge } from './map-count-badge';
import { StationMarkersComponent } from './station-markers';

/** The stations of the active save and the player ship counts per sector. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appMapSaveMarkers]',
	imports: [MapCountBadge, StationMarkersComponent],
	templateUrl: './map-save-markers.html',
})
export class MapSaveMarkers {
	static readonly DETAIL_SCALE = StationMarkersComponent.DETAIL_SCALE;
	static readonly LABEL_SCALE = StationMarkersComponent.LABEL_SCALE;
	private static readonly SIZES = ['XS', 'S', 'M', 'L', 'XL'];

	protected readonly store = inject(MapStore);
	protected readonly stations = inject(MapStations);
	private readonly save = inject(MapSaveLayer);

	/** Badges of the drawn sectors that hold player ships. */
	protected readonly badges = computed(() => {
		const drawn = this.store.drawnIds();
		// never larger than a share of the sector on screen
		const cap = (r: number) => Math.min(this.store.panZoom.fontSize() * 0.8, r * 0.45);
		return [...this.save.playerShips()].flatMap(([sector, ships]) => {
			const shape = this.store.shapeById.get(sector);
			const radius = shape ? cap(shape.r) : 0;
			return shape && drawn.has(sector)
				? [
						{
							sector,
							x: shape.x + shape.r * 0.5,
							y: shape.y - shape.r * 0.5,
							count: ships.total,
							title: MapSaveMarkers.shipTitle(ships),
							radius,
						},
					]
				: [];
		});
	});

	protected show(hover: StationHover | undefined) {
		if (hover) {
			this.store.hovered.set(undefined);
		}
		this.stations.hovered.set(hover);
	}

	/** The non-zero counts of `[xs, s, m, l, xl]`, e.g. "S 3, M 9". */
	static sizeSplit(bySize: number[]): string {
		return bySize
			.map((count, i) => (count ? `${MapSaveMarkers.SIZES[i]} ${count}` : ''))
			.filter((x) => x)
			.join(', ');
	}

	private static shipTitle(ships: { total: number; bySize: number[] }): string {
		const split = MapSaveMarkers.sizeSplit(ships.bySize);
		return $localize`${ships.total}:total: player ships (${split}:split:)`;
	}
}
