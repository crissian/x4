import { Component, input, output } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { StationIcons } from '../station-icons';
import { StationHover, StationMarker, StationMarkers } from '../station-marker';

/** Station markers: dots when zoomed out, type icons (or a factory's ware) when zoomed in, and names when zoomed in further. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appStationMarkers]',
	imports: [LucideDynamicIcon],
	templateUrl: './station-markers.html',
	styleUrl: './station-markers.css',
})
export class StationMarkersComponent {
	/** Screen pixels per map unit from which stations show as icon markers instead of dots. */
	static readonly DETAIL_SCALE = 14;
	/** Screen pixels per map unit from which station names show. */
	static readonly LABEL_SCALE = 36;

	readonly markers = input.required<StationMarker[]>();
	/** Screen pixels per map unit. */
	readonly scale = input.required<number>();
	/** Marker size in map units. */
	readonly fontSize = input.required<number>();
	/** The marker under the pointer, undefined when the pointer leaves it. */
	readonly stationHover = output<StationHover | undefined>();

	/** Fill of a factory marker showing its ware: dark, so the white ware glyph stays readable. */
	static readonly WARE_FILL = '#334155';
	/** Colour of the type icons and the marker outlines. */
	static readonly DARK = '#05080f';

	protected readonly neutral = StationMarkers.NEUTRAL;
	protected readonly icons = StationIcons;
	protected readonly wareFill = StationMarkersComponent.WARE_FILL;
	protected readonly dark = StationMarkersComponent.DARK;
	/** Icon size as a share of the marker size: 70% of the circle's diameter (1.2 × the size). */
	protected readonly iconShare = 0.84;
	protected readonly detailScale = StationMarkersComponent.DETAIL_SCALE;
	protected readonly labelScale = StationMarkersComponent.LABEL_SCALE;

	protected show(event: PointerEvent, marker: StationMarker) {
		const rect = (event.currentTarget as SVGElement).ownerSVGElement?.getBoundingClientRect();
		this.stationHover.emit({
			marker,
			x: event.clientX - (rect?.left ?? 0),
			y: event.clientY - (rect?.top ?? 0),
		});
	}
}
