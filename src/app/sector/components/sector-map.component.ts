import { Component, ElementRef, computed, effect, inject, input, signal, untracked, viewChild } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { RouterLink } from '@angular/router';
import { StationMarkersComponent } from '../../map/canvas/station-markers';
import { StationTooltipComponent } from '../../map/canvas/station-tooltip';
import { GalaxyLayout } from '../../map/galaxy-layout';
import { MapZoomButtonsComponent } from '../../map/map-zoom-buttons.component';
import { MapGeometry } from '../../map/map-geometry';
import { MapRects } from '../../map/map-rects';
import { PanZoom, PanZoomLimits, Rect } from '../../map/pan-zoom';
import { PanZoomArea } from '../../map/pan-zoom-area';
import { MAP_SHAPES, MapSaveLayer } from '../../map/save/map-save-layer';
import { SaveStationNames } from '../../map/save/save-station-names';
import { StationHover, StationMarker, StationMarkers } from '../../map/station-marker';
import { ActiveSave } from '../../savegame/active-save';
import { AppDialog } from '../../shared/components/modal/dialog';
import { FactionService } from '../../shared/services/faction.service';
import { SectorService } from '../../shared/services/universe.service';
import { SectorMapDialogComponent } from './sector-map-dialog.component';

/**
 * A zoomable map of one sector: its hex, gates and accelerators, and stations drawn like on the universe map.
 * The stations come from the active save when it has map data, else from the game start.
 */
@Component({
	selector: 'app-sector-map',
	imports: [
		RouterLink,
		MapZoomButtonsComponent,
		StationMarkersComponent,
		StationTooltipComponent,
	],
	templateUrl: './sector-map.component.html',
	providers: [MapGeometry, MapSaveLayer, { provide: MAP_SHAPES, useFactory: () => inject(MapGeometry).shapeById }],
})
export class SectorMapComponent {
	readonly sector = input.required<string>();
	/** Fills its container, as in the enlarged dialog, instead of the fixed size beside the description. */
	readonly fill = input(false);

	private readonly geometry = inject(MapGeometry);
	private readonly layer = inject(MapSaveLayer);
	private readonly activeSave = inject(ActiveSave);
	private readonly sectors = inject(SectorService);
	private readonly factions = inject(FactionService);
	private readonly dialog = inject(Dialog);
	private readonly area = viewChild.required<ElementRef<HTMLElement>>('area');

	readonly surface = new PanZoomArea(
		this.area,
		() => this.limits(),
		() => this.reset()
	);
	readonly hovered = signal<StationHover | undefined>(undefined);

	readonly shape = computed(() => this.geometry.shapeById.get(this.sector()));
	/** Same source as the stations card: the active save when it has map data. */
	readonly fromSave = computed(() => !!this.activeSave.map());
	private readonly godStations = inject(SaveStationNames).godStations(() => !this.fromSave());

	readonly markers = computed<StationMarker[]>(() => {
		const shape = this.shape();
		if (!shape) {
			return [];
		}
		if (this.fromSave()) {
			return this.layer
				.stations()
				.filter((x) => x.station.sector === shape.sector.id)
				.map((x) => StationMarkers.fromSave(x));
		}
		// the index over all stations places those without a fixed spot like the universe map does
		return (this.godStations() ?? []).flatMap((x, i) =>
			x.sector === shape.sector.id
				? [StationMarkers.fromGameStart(x, i, shape, this.factions.getEntity(x.owner ?? ''))]
				: []
		);
	});

	/** Gates and accelerators with a position, and the sectors they lead to. */
	readonly gates = computed(() => {
		const shape = this.shape();
		if (!shape) {
			return [];
		}
		return shape.sector.gates.flatMap((gate) => {
			const sector = this.sectors.getEntity(gate.sector);
			return sector && gate.x != null && gate.z != null
				? [{ type: gate.type, sector, ...GalaxyLayout.markerPosition(shape, gate.x, gate.z) }]
				: [];
		});
	});

	/** Colour of the sector owner, in the active save or at game start. */
	readonly ownerColor = computed(() => this.layer.ownerColor(this.shape()?.sector));

	constructor() {
		// a gate link keeps the page and changes the sector
		effect(() => {
			this.shape();
			untracked(() => {
				this.hovered.set(undefined);
				this.reset();
			});
		});
	}

	/** Fits the whole hex into the view. */
	reset() {
		const box = this.hexBox();
		if (box) {
			this.surface.view.set(PanZoom.fit(box, this.surface.size(), 0.04));
		}
	}

	/** Opens the map enlarged in a dialog. */
	expand() {
		AppDialog.open(this.dialog, SectorMapDialogComponent, { data: this.sector(), size: 'xl' });
	}

	protected onPointerMove(event: PointerEvent) {
		if (this.surface.pointerMove(event)) {
			this.hovered.set(undefined);
		}
	}

	/** The bounding box of the hex: the view centre stays inside it, and it limits zooming out. */
	private hexBox(): Rect | undefined {
		const shape = this.shape();
		return shape ? MapRects.box([shape]) : undefined;
	}

	private limits(): PanZoomLimits {
		const r = this.shape()?.r ?? 1;
		return { minWidth: r / 6, maxWidth: r * 6, bounds: this.hexBox(), pinch: true };
	}
}
