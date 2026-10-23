import { Component, computed, inject } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { SectorShape } from '../galaxy-layout';
import { MapLabel } from '../map-label';
import { MapStations } from '../map-stations';
import { MapStore } from '../map-store';
import { MapSaveAbandoned } from '../save/map-save-abandoned';
import { MapSaveLayer } from '../save/map-save-layer';
import { MapSaveSectors } from '../save/map-save-sectors';
import { StationIcons } from '../station-icons';
import { StationMarkersComponent } from './station-markers';
import { NumberFormats } from '../../core/format/number-formats';

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
	imports: [LucideDynamicIcon],
	templateUrl: './map-markers-layer.html',
})
export class MapMarkersLayer {
	protected readonly store = inject(MapStore);
	protected readonly stations = inject(MapStations);
	protected readonly save = inject(MapSaveLayer);
	protected readonly abandoned = inject(MapSaveAbandoned);
	protected readonly icons = StationIcons;
	protected readonly dark = StationMarkersComponent.DARK;
}

/** Sector names, or cluster names when zoomed out too far for the sector names. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appMapLabels]',
	host: {
		'text-anchor': 'middle',
		fill: '#f1f5f9',
		'[attr.font-size]': 'store.panZoom.fontSize()',
	},
	templateUrl: './map-labels-layer.html',
})
export class MapLabelsLayer {
	protected readonly store = inject(MapStore);
	private readonly saveSectors = inject(MapSaveSectors);

	protected readonly labels = computed(() => {
		const store = this.store;
		if (!store.showSectorLabels()) {
			return this.clusterLabels();
		}
		const unknown = this.saveSectors.unknown();
		return store
			.visibleShapes()
			.map((shape) => ({
				x: shape.x,
				y: shape.y,
				lines: this.sectorLines(shape),
				dim: unknown.has(shape.sector.id),
			}))
			.filter((x) => x.lines.length);
	});

	private sectorLines(shape: SectorShape): string[] {
		const lines = MapLabel.wrap(shape.sector.name);
		if (this.store.mode() === 'sunlight' && shape.sector.sunlight != null) {
			lines.push(`☀ ${NumberFormats.percent(shape.sector.sunlight)}`);
		}
		return lines;
	}

	/**
	 * Single sector systems keep their sector name (dimmed when undiscovered); larger systems show the system name.
	 */
	private clusterLabels() {
		const seen = new Set<string>();
		const unknown = this.saveSectors.unknown();
		const result: { x: number; y: number; lines: string[]; dim: boolean }[] = [];
		for (const shape of this.store.visibleShapes()) {
			if (shape.cluster.sectors.length === 1) {
				result.push({
					x: shape.x,
					y: shape.y,
					lines: this.sectorLines(shape),
					dim: unknown.has(shape.sector.id),
				});
			} else if (!seen.has(shape.cluster.id)) {
				seen.add(shape.cluster.id);
				result.push({
					x: shape.cluster.x / 1000,
					y: -shape.cluster.z / 1000,
					lines: MapLabel.wrap(shape.cluster.name),
					dim: false,
				});
			}
		}
		return result;
	}
}
