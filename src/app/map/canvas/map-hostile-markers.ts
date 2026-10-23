import { Component, computed, inject } from '@angular/core';
import { MapStore } from '../map-store';
import { MapHostiles } from '../save/map-hostiles';
import { MapCountBadge } from './map-count-badge';

/** The Xenon and Kha'ak layers: a badge per sector with their station count, or ship count without stations. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appMapHostileMarkers]',
	imports: [MapCountBadge],
	templateUrl: './map-hostile-markers.html',
})
export class MapHostileMarkers {
	protected readonly store = inject(MapStore);
	private readonly hostiles = inject(MapHostiles);

	protected readonly badges = computed(() => {
		const font = this.store.panZoom.fontSize();
		return this.hostiles.markers().map((marker) => {
			const { shape } = marker;
			// Xenon bottom left, Kha'ak top left; the player ship badge sits top right
			const dy = marker.faction === 'xenon' ? 0.5 : -0.5;
			const radius = Math.min(font * 0.8, shape.r * 0.45) * (marker.stations ? 1 : 0.7);
			return {
				key: `${marker.faction}|${marker.sector}`,
				x: shape.x - shape.r * 0.5,
				y: shape.y + shape.r * dy,
				count: marker.stations || marker.shipTotal,
				color: MapHostiles.COLORS[marker.faction],
				title: MapHostiles.title(marker, shape.sector),
				radius,
			};
		});
	});
}
