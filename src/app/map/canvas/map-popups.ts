import { DecimalPipe, PercentPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MapStore } from '../map-store';
import { MapSaveSectorInfo } from './map-save-sector-info';

/** Details of the sector under the pointer. */
@Component({
	selector: 'app-map-tooltip',
	imports: [DecimalPipe, PercentPipe, MapSaveSectorInfo],
	templateUrl: './map-tooltip.html',
})
export class MapTooltipComponent {
	protected readonly store = inject(MapStore);
	protected readonly faction = computed(() =>
		this.store.faction(this.store.sectorOwner(this.store.hovered()?.shape.sector))
	);
}

/** Right-click menu of a sector. */
@Component({
	selector: 'app-map-menu',
	templateUrl: './map-menu.html',
})
export class MapMenuComponent {
	protected readonly store = inject(MapStore);
	private readonly router = inject(Router);

	protected action(action: 'from' | 'to' | 'open') {
		const sector = this.store.menu()?.sector;
		this.store.menu.set(undefined);
		if (!sector) {
			return;
		}
		switch (action) {
			case 'from':
				this.store.setRouteFrom(sector.id);
				if (this.store.tab() === 'abandoned') {
					this.store.tab.set('route');
				}
				break;
			case 'to':
				this.store.setRouteTo(sector.id);
				this.store.tab.set('route');
				break;
			case 'open':
				this.router.navigate(['/sectors', sector.id]);
				break;
		}
	}
}
