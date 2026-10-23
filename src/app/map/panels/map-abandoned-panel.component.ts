import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { MapStore } from '../map-store';
import { MapSaveAbandoned } from '../save/map-save-abandoned';
import { MapFocusLinkComponent } from './map-focus-link.component';

@Component({
	selector: 'app-map-abandoned-panel',
	imports: [DecimalPipe, FormField, RouterLink, MapFocusLinkComponent],
	templateUrl: './map-abandoned-panel.component.html',
})
export class MapAbandonedPanelComponent {
	protected readonly store = inject(MapStore);
	protected readonly save = inject(MapSaveAbandoned);
}
