import { Component, computed, inject } from '@angular/core';
import { SectorShape } from '../galaxy-layout';
import { MapStore, wrap } from '../map-store';

/** Gates, accelerators, superhighways and the planned route. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appMapLinks]',
	host: { class: 'pointer-events-none' },
	template: `
		@for (link of store.visibleLinks(); track $index) {
			<svg:line
				[attr.x1]="link.x1"
				[attr.y1]="link.y1"
				[attr.x2]="link.x2"
				[attr.y2]="link.y2"
				[attr.stroke]="link.type === 'gate' ? '#e2e8f0' : link.type === 'accelerator' ? '#fbbf24' : '#38bdf8'"
				[attr.stroke-width]="link.type === 'gate' ? 2 : 1.5"
				[attr.stroke-dasharray]="link.type === 'gate' ? null : link.type === 'accelerator' ? '6 4' : '2 3'"
				stroke-linecap="round"
				vector-effect="non-scaling-stroke"
			/>
			@if (link.type === 'gate') {
				<svg:circle [attr.cx]="link.x1" [attr.cy]="link.y1" [attr.r]="store.fontSize() * 0.3" fill="#e2e8f0" />
				<svg:circle [attr.cx]="link.x2" [attr.cy]="link.y2" [attr.r]="store.fontSize() * 0.3" fill="#e2e8f0" />
			}
		}

		@if (store.routePoints()) {
			<svg:polyline
				[attr.points]="store.routePoints()"
				fill="none"
				stroke="#fde047"
				stroke-width="5"
				stroke-opacity="0.85"
				stroke-linejoin="round"
				stroke-linecap="round"
				vector-effect="non-scaling-stroke"
			/>
		}
	`,
})
export class MapLinksLayer {
	protected readonly store = inject(MapStore);
}

/** Abandoned ships and game start stations. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appMapMarkers]',
	template: `
		@if (store.abandonedModel().show) {
			@for (marker of store.abandoned(); track $index) {
				@let size = store.fontSize() * 0.9;
				<svg:g class="cursor-pointer" [attr.data-sector]="marker.item.sector">
					<svg:title i18n>
						Abandoned {{ marker.ship?.name ?? marker.item.ship
						}}{{ marker.item.condition ? ' (' + marker.item.condition + ')' : '' }}
					</svg:title>
					<svg:rect
						[attr.x]="marker.x - size / 2"
						[attr.y]="marker.y - size / 2"
						[attr.width]="size"
						[attr.height]="size"
						[attr.transform]="'rotate(45 ' + marker.x + ' ' + marker.y + ')'"
						[attr.fill]="marker.item.condition ? '#c084fc' : '#f472b6'"
						stroke="#05080f"
						stroke-width="1"
						vector-effect="non-scaling-stroke"
					/>
				</svg:g>
			}
		}

		@for (marker of store.stationMarkers(); track marker.station.id) {
			<svg:g class="cursor-pointer" [attr.data-sector]="marker.station.sector">
				<svg:title>
					{{ marker.type.label }}{{ marker.faction ? ' - ' + marker.faction.name : '' }} ({{
						marker.shape.sector.name
					}})
				</svg:title>
				<svg:circle
					[attr.cx]="marker.x"
					[attr.cy]="marker.y"
					[attr.r]="store.fontSize() * 0.6"
					[attr.fill]="marker.type.color"
					stroke="#05080f"
					stroke-width="1"
					vector-effect="non-scaling-stroke"
				/>
				<svg:text
					class="pointer-events-none"
					[attr.x]="marker.x"
					[attr.y]="marker.y"
					[attr.font-size]="store.fontSize() * 0.8"
					text-anchor="middle"
					dominant-baseline="central"
					font-weight="700"
					fill="#05080f"
				>
					{{ marker.type.letter }}
				</svg:text>
			</svg:g>
		}
	`,
})
export class MapMarkersLayer {
	protected readonly store = inject(MapStore);
}

/** Sector names, or cluster names when zoomed out too far for the sector names. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appMapLabels]',
	host: {
		class: 'pointer-events-none',
		'text-anchor': 'middle',
		fill: '#f1f5f9',
		'[attr.font-size]': 'store.fontSize()',
	},
	template: `
		@if (store.showLabels()) {
			@for (label of labels(); track $index) {
				@for (line of label.lines; track $index) {
					<svg:text
						[attr.x]="label.x"
						[attr.y]="label.y + ($index - (label.lines.length - 1) / 2) * store.fontSize() * 1.2"
						dominant-baseline="middle"
						paint-order="stroke"
						stroke="#05080f"
						[attr.stroke-width]="store.fontSize() * 0.25"
						[attr.font-weight]="line.startsWith('☀') ? 400 : 600"
					>
						{{ line }}
					</svg:text>
				}
			}
		}
	`,
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
		const lines = wrap(shape.sector.name);
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
				result.push({ x: shape.cluster.x / 1000, y: -shape.cluster.z / 1000, lines: wrap(shape.cluster.name) });
			}
		}
		return result;
	}
}
