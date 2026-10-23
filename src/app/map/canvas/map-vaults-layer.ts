import { Component, inject } from '@angular/core';
import { MapStore } from '../map-store';
import { MapVaults } from '../map-vaults';

/** Data vault markers: amber until the player has the vault, then grey. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- SVG content has to be an attribute on <g>
	selector: 'g[appMapVaults]',
	templateUrl: './map-vaults-layer.html',
})
export class MapVaultsLayer {
	protected readonly store = inject(MapStore);
	protected readonly vaults = inject(MapVaults);
}
