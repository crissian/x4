import { Component, computed, inject } from '@angular/core';
import { SectorShape } from '../galaxy-layout';
import { MapLabel } from '../map-label';
import { MapStations } from '../map-stations';
import { MapStore } from '../map-store';
import { MapSaveLayer } from '../save/map-save-layer';

/** Gates, accelerators, superhighways and the planned route. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appMapLinks]',
	templateUrl: './map-links-layer.html',
})
export class MapLinksLayer {
	protected readonly store = inject(MapStore);
}

/** Abandoned ships and game start stations. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appMapMarkers]',
	templateUrl: './map-markers-layer.html',
})
export class MapMarkersLayer {
	protected readonly store = inject(MapStore);
	protected readonly stations = inject(MapStations);
	protected readonly save = inject(MapSaveLayer);
}

/** Sector names, or cluster names when zoomed out too far for the sector names. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appMapLabels]',
	host: {
		'text-anchor': 'middle',
		fill: '#f1f5f9',
		'[attr.font-size]': 'store.fontSize()',
	},
	templateUrl: './map-labels-layer.html',
})
export class MapLabelsLayer {
	protected readonly store = inject(MapStore);

	protected readonly labels = computed(() => {
		const store = this.store;
		if (!store.showSectorLabels()) {
			return this.clusterLabels();
		}
		return store
			.visibleShapes()
			.map((shape) => ({ x: shape.x, y: shape.y, lines: this.sectorLines(shape) }))
			.filter((x) => x.lines.length);
	});

	private sectorLines(shape: SectorShape): string[] {
		const lines = MapLabel.wrap(shape.sector.name);
		if (this.store.mode() === 'sunlight' && shape.sector.sunlight != null) {
			lines.push(`☀ ${Math.round(shape.sector.sunlight * 100)}%`);
		}
		return lines;
	}

	/** Single sector systems keep their sector name; larger systems show the system name. */
	private clusterLabels() {
		const seen = new Set<string>();
		const result: { x: number; y: number; lines: string[] }[] = [];
		for (const shape of this.store.visibleShapes()) {
			if (shape.cluster.sectors.length === 1) {
				result.push({ x: shape.x, y: shape.y, lines: this.sectorLines(shape) });
			} else if (!seen.has(shape.cluster.id)) {
				seen.add(shape.cluster.id);
				result.push({ x: shape.cluster.x / 1000, y: -shape.cluster.z / 1000, lines: MapLabel.wrap(shape.cluster.name) });
			}
		}
		return result;
	}
}
