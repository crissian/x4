import { DecimalPipe, PercentPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MapStore } from '../map-store';
import { MapSaveLayer } from '../save/map-save-layer';
import { MapSaveSectorInfo } from './map-save-sector-info';
import { FactionLabelComponent } from '../../shared/components/faction-label.component';

/** Details of the sector under the pointer. */
@Component({
	selector: 'app-map-tooltip',
	imports: [FactionLabelComponent, DecimalPipe, PercentPipe, MapSaveSectorInfo],
	templateUrl: './map-tooltip.html',
})
export class MapTooltipComponent {
	protected readonly store = inject(MapStore);
	private readonly save = inject(MapSaveLayer);
	protected readonly faction = computed(() => this.save.ownerFaction(this.store.hovered()?.shape.sector));
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
