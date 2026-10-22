import { Component, computed, inject } from '@angular/core';
import { MapStations, StationMarker } from '../map-stations';
import { NEUTRAL, MapStore } from '../map-store';
import { MapSaveLayer } from '../save/map-save-layer';
import { MapCountBadge } from './map-count-badge';

/** The stations of the active save and the player ship counts per sector. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appMapSaveMarkers]',
	imports: [MapCountBadge],
	templateUrl: './map-save-markers.html',
	styleUrl: './map-save-markers.css',
})
export class MapSaveMarkers {
	/** Screen pixels per map unit from which stations show as letter markers instead of dots. */
	static readonly DETAIL_SCALE = 14;
	/** Screen pixels per map unit from which station names show. */
	static readonly LABEL_SCALE = 36;
	private static readonly SIZES = ['XS', 'S', 'M', 'L', 'XL'];

	protected readonly store = inject(MapStore);
	protected readonly stations = inject(MapStations);
	private readonly save = inject(MapSaveLayer);

	protected readonly neutral = NEUTRAL;
	protected readonly detailed = computed(() => this.store.scale() >= MapSaveMarkers.DETAIL_SCALE);
	protected readonly labelled = computed(() => this.store.scale() >= MapSaveMarkers.LABEL_SCALE);
	/** Dot radius: a constant size on screen. */
	protected readonly dot = computed(() => 2.5 / this.store.scale());

	/** Badges of the drawn sectors that hold player ships. */
	protected readonly badges = computed(() => {
		const drawn = this.store.drawnIds();
		// never larger than a share of the sector on screen
		const cap = (r: number) => Math.min(this.store.fontSize() * 0.8, r * 0.45);
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

	protected show(event: PointerEvent, marker: StationMarker) {
		const rect = (event.currentTarget as SVGElement).ownerSVGElement?.getBoundingClientRect();
		this.store.hovered.set(undefined);
		this.stations.hovered.set({
			marker,
			x: event.clientX - (rect?.left ?? 0),
			y: event.clientY - (rect?.top ?? 0),
		});
	}

	private static shipTitle(ships: { total: number; bySize: number[] }): string {
		const split = ships.bySize
			.map((count, i) => (count ? `${MapSaveMarkers.SIZES[i]} ${count}` : ''))
			.filter((x) => x)
			.join(', ');
		return $localize`${ships.total}:total: player ships (${split}:split:)`;
	}
}
