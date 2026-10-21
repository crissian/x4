import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { STATION_TYPES } from '../../shared/services/constants';
import { MapStore } from '../map-store';
import { formatDuration } from '../route-planner';
import { MapFocusLinkComponent } from './map-focus-link.component';

@Component({
	selector: 'app-map-stations-panel',
	imports: [FormField, MapFocusLinkComponent],
	template: `
		<div class="mb-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
			@for (type of stationTypes; track type.id) {
				<label class="flex items-center gap-1.5">
					<input type="checkbox" [formField]="form.types[type.id]" />
					<span class="inline-block size-2.5 rounded-full" [style.background]="type.color"></span>
					{{ type.label }}
				</label>
			}
		</div>

		<h6>Where to buy</h6>
		<input
			class="input"
			list="map-buy-items"
			placeholder="Ship or equipment..."
			aria-label="Ship or equipment"
			[formField]="form.buy"
		/>
		<datalist id="map-buy-items">
			@for (item of store.buyOptions; track item.id) {
				<option [value]="item.name"></option>
			}
		</datalist>
		@if (store.buyItem()) {
			<p class="my-2 text-xs text-fg-muted">
				@if (store.routeFrom(); as from) {
					Closest to {{ store.sectorName(from) }}.
				} @else {
					Set a route start to sort by travel time.
				}
				Licence and reputation still apply.
			</p>
			<table class="table text-sm">
				<tbody>
					@for (item of store.sellers(); track item.station.id) {
						<tr>
							<td>
								<span
									class="mr-1 inline-block size-2.5 rounded-full"
									[style.background]="item.type.color"
								></span>
								{{ item.type.label }}
								<div class="text-xs text-fg-muted">{{ item.faction?.name ?? item.station.owner }}</div>
							</td>
							<td><app-map-focus-link [sector]="item.shape.sector" /></td>
							@if (item.time != null) {
								<td class="text-right whitespace-nowrap">{{ formatDuration(item.time) }}</td>
							}
						</tr>
					} @empty {
						<tr>
							<td class="text-fg-muted">No station sells it at game start.</td>
						</tr>
					}
				</tbody>
			</table>
		}

		<h6 class="mt-4">All stations ({{ store.stationMarkers().length }})</h6>
		<table class="table text-sm">
			<tbody>
				@for (item of store.stationMarkers(); track item.station.id) {
					<tr>
						<td>
							<span
								class="mr-1 inline-block size-2.5 rounded-full"
								[style.background]="item.type.color"
							></span>
							{{ item.type.label }}
							<div class="text-xs text-fg-muted">{{ item.faction?.name ?? item.station.owner }}</div>
						</td>
						<td><app-map-focus-link [sector]="item.shape.sector" /></td>
					</tr>
				}
			</tbody>
		</table>
		<p class="mt-2 text-xs text-fg-muted">
			Stations the game creates at the start; factions build and lose stations as the game goes on.
		</p>
	`,
})
export class MapStationsPanelComponent {
	protected readonly store = inject(MapStore);
	protected readonly form = this.store.stationsForm;
	protected readonly stationTypes = STATION_TYPES;
	protected readonly formatDuration = formatDuration;
}
