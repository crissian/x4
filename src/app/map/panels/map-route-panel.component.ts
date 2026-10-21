import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { MapStore } from '../map-store';
import { formatDuration } from '../route-planner';

@Component({
	selector: 'app-map-route-panel',
	imports: [DecimalPipe, FormField, RouterLink],
	template: `
		<div class="grid gap-2">
			<div class="flex gap-1">
				<div class="grid flex-1 gap-2">
					<input
						class="input"
						list="map-sectors"
						placeholder="From sector..."
						aria-label="From sector"
						[formField]="form.from"
					/>
					<input
						class="input"
						list="map-sectors"
						placeholder="To sector..."
						aria-label="To sector"
						[formField]="form.to"
					/>
				</div>
				<button type="button" class="btn btn-secondary self-center" title="Swap" (click)="store.swapRoute()">
					⇅
				</button>
			</div>
			<select class="input" aria-label="Ship" [formField]="form.ship">
				<option value="">Custom travel speed</option>
				@for (ship of store.routeShips; track ship.id) {
					<option [value]="ship.id">{{ ship.name }} ({{ ship.size }})</option>
				}
			</select>
			<div class="grid grid-cols-2 gap-2">
				<label class="text-sm">
					Travel speed (m/s)
					<input class="input" type="number" [formField]="form.speed" />
				</label>
				<label class="text-sm">
					Drive charge (s)
					<input class="input" type="number" [formField]="form.charge" />
				</label>
			</div>
		</div>
		@if (store.route(); as route) {
			<div class="mt-3">
				<strong>{{ formatDuration(route.time) }}</strong
				>, {{ route.jumps }} jumps, {{ route.distance | number: '1.0-0' }} km in sectors
			</div>
			<ol class="mt-2 list-decimal pl-6 text-sm">
				@for (step of route.steps; track $index) {
					<li>
						<a [routerLink]="['/sectors', step.sector.id]">{{ step.sector.name }}</a>
						@if (step.type !== 'start') {
							<span class="text-fg-muted"> - {{ step.type }}, {{ formatDuration(step.time) }}</span>
						}
					</li>
				}
			</ol>
		} @else if (store.routeFrom() && store.routeTo()) {
			<p class="mt-3 text-fg-muted">No route between these sectors with the selected DLCs.</p>
		} @else {
			<p class="mt-3 text-sm text-fg-muted">Pick two sectors, or right-click sectors on the map.</p>
		}
		<p class="mt-3 text-xs text-fg-muted">
			Center to center with the travel drive between gates; gates and accelerators count 10 s, superhighways 40 s.
			Estimates only.
		</p>
	`,
})
export class MapRoutePanelComponent {
	protected readonly store = inject(MapStore);
	protected readonly form = this.store.routeForm;
	protected readonly formatDuration = formatDuration;
}
