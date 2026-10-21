import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { MapStore } from '../map-store';
import { MapFocusLinkComponent } from './map-focus-link.component';

@Component({
	selector: 'app-map-abandoned-panel',
	imports: [DecimalPipe, FormField, RouterLink, MapFocusLinkComponent],
	template: `
		<label class="mb-2 flex items-center gap-1.5 text-sm">
			<input type="checkbox" [formField]="store.abandonedForm.show" />
			Show on map
		</label>
		<table class="table text-sm">
			<tbody>
				@for (marker of store.abandoned(); track $index) {
					<tr>
						<td>
							@if (marker.ship) {
								<a [routerLink]="['/ships', marker.ship.id]">{{ marker.ship.name }}</a>
							} @else {
								{{ marker.item.ship }}
							}
							@if (marker.item.condition) {
								<div class="text-xs text-fg-muted">{{ marker.item.condition }}</div>
							}
						</td>
						<td>
							<app-map-focus-link [sector]="marker.shape.sector" />
							<div class="text-xs text-fg-muted">
								{{ marker.item.x | number: '1.0-0' }}, {{ marker.item.y | number: '1.0-0' }},
								{{ marker.item.z | number: '1.0-0' }} km
							</div>
						</td>
					</tr>
				} @empty {
					<tr>
						<td class="text-fg-muted">None for the selected DLCs</td>
					</tr>
				}
			</tbody>
		</table>
		<p class="mt-2 text-xs text-fg-muted">
			Ownerless ships placed at game start; claim them by boarding with a spacesuit.
		</p>
	`,
})
export class MapAbandonedPanelComponent {
	protected readonly store = inject(MapStore);
}
