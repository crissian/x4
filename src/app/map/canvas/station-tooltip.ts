import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StationTrade } from '../../savegame/map/station-trade';
import { WareService } from '../../shared/services/ware.service';
import { PanZoom, ViewSize } from '../pan-zoom';
import { StationHover } from '../station-marker';
import { StationTypeBadgeComponent } from '../station-type-badge.component';

/** Details of the station under the pointer, kept inside the map. */
@Component({
	selector: 'app-station-tooltip',
	imports: [DecimalPipe, RouterLink, StationTypeBadgeComponent],
	templateUrl: './station-tooltip.html',
})
export class StationTooltipComponent {
	/** Tooltip width in pixels: `w-64` in the template. */
	private static readonly WIDTH = 256;

	readonly hover = input<StationHover | undefined>();
	/** Size of the map in pixels. */
	readonly size = input.required<ViewSize>();
	/**
	 * For a small map: the tooltip stays within the map's width and spills below it onto the page, instead of
	 * flipping to the other side of the pointer.
	 */
	readonly spill = input(false);
	/** Whether the pointer can reach the tooltip: the product then links to its ware page. */
	readonly interactive = input(false);

	private readonly wares = inject(WareService);

	protected readonly left = computed(() => {
		const x = (this.hover()?.x ?? 0) + 16;
		return this.spill() ? Math.max(0, Math.min(x, this.size().width - StationTooltipComponent.WIDTH)) : x;
	});
	/** Up to three sold and bought ware names of a save station, and how many more. */
	protected readonly trade = computed(() => {
		const marker = this.hover()?.marker;
		const names = (ids: string[] | undefined) =>
			StationTrade.firstOf((ids ?? []).map((id) => this.wares.getEntity(id)?.name ?? id));
		return { sells: names(marker?.sells), buys: names(marker?.buys) };
	});
	protected readonly productName = computed(() => {
		const id = this.hover()?.marker.product;
		return id ? (this.wares.getEntity(id)?.name ?? id) : '';
	});
	protected readonly transform = computed(() => {
		const hover = this.hover();
		return hover && !this.spill() ? PanZoom.keepInside(hover.x, hover.y, this.size()) : null;
	});
}
