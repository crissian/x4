import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { MapStore } from '../map-store';
import { formatDuration } from '../route-planner';

@Component({
	selector: 'app-map-mining-panel',
	imports: [DecimalPipe, FormField, RouterLink],
	template: `
		<div class="grid gap-2">
			<select class="input" aria-label="Resource" [formField]="store.settingsForm.resource">
				@for (ware of store.resourceWares; track ware.id) {
					<option [value]="ware.id">{{ ware.name }}</option>
				}
			</select>
			<input
				class="input"
				list="map-sectors"
				placeholder="Home sector (where you sell)..."
				aria-label="Home sector"
				[formField]="store.routeForm.from"
			/>
			<select class="input" aria-label="Miner" [formField]="form.miner">
				@for (ship of store.miners(); track ship.id) {
					<option [value]="ship.id">{{ ship.name }} ({{ ship.size }})</option>
				} @empty {
					<option value="">No miner carries this ware</option>
				}
			</select>
			<div class="grid grid-cols-2 gap-2">
				<label class="text-sm">
					Minutes to fill hold
					<input class="input" type="number" [formField]="form.fillMinutes" />
				</label>
				<label class="text-sm">
					Sell price
					<select class="input" [formField]="form.price">
						<option value="min">Min ({{ store.miningWare()?.price.min | number }})</option>
						<option value="avg">Avg ({{ store.miningWare()?.price.avg | number }})</option>
						<option value="max">Max ({{ store.miningWare()?.price.max | number }})</option>
					</select>
				</label>
			</div>
		</div>
		<p class="my-2 text-xs text-fg-muted">
			@if (store.routeFrom()) {
				Credits per hour for one miner: fly there at full travel speed, fill the hold, fly back and sell.
			} @else {
				Richest sectors. Set a home sector to rank them by credits per hour.
			}
		</p>
		<table class="table text-sm">
			<thead>
				<tr>
					<th>Sector</th>
					@if (store.routeFrom()) {
						<th class="text-right">Trip</th>
						<th class="text-right">Cr/h</th>
					} @else {
						<th class="text-right">Amount</th>
					}
				</tr>
			</thead>
			<tbody>
				@for (item of store.miningSectors(); track item.sector.id) {
					<tr>
						<td>
							<a [routerLink]="['/sectors', item.sector.id]">{{ item.sector.name }}</a>
							@if (store.routeFrom()) {
								<div class="text-xs text-fg-muted">
									{{ item.jumps }} jumps, {{ item.amount | number }} units
								</div>
							}
						</td>
						@if (item.trip; as trip) {
							<td class="text-right whitespace-nowrap">{{ formatDuration(trip.tripTime) }}</td>
							<td class="text-right font-semibold">{{ trip.perHour | number: '1.0-0' }}</td>
						} @else {
							<td class="text-right">{{ item.amount | number }}</td>
						}
					</tr>
				} @empty {
					<tr>
						<td colspan="3" class="text-fg-muted">None</td>
					</tr>
				}
			</tbody>
		</table>
		@if (store.miner(); as miner) {
			<p class="mt-2 text-xs text-fg-muted">
				{{ miner.name }}: {{ store.miningUnits() | number }} units per trip, travel
				{{ store.minerSpeed() | number: '1.0-0' }} m/s with its fastest engine. Mining speed depends on the
				asteroid, equipment and crew, so set the fill time from experience.
			</p>
		}
	`,
})
export class MapMiningPanelComponent {
	protected readonly store = inject(MapStore);
	protected readonly form = this.store.miningForm;
	protected readonly formatDuration = formatDuration;
}
