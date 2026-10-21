import { Component, inject, signal } from '@angular/core';
import { STATION_TYPES } from '../../shared/services/constants';
import { MapStore } from '../map-store';

/** Collapsible legend of the sector colors, connections and markers. */
@Component({
	selector: 'app-map-legend',
	host: {
		class: 'absolute bottom-3 left-3 max-h-[45%] max-w-[calc(100%-1.5rem)] overflow-y-auto rounded-md border border-white/10 bg-black/70 p-2.5 text-xs text-slate-200 backdrop-blur',
		'(pointerdown)': '$event.stopPropagation()',
	},
	template: `
		<button type="button" class="float-right ml-3 text-slate-400 hover:text-white" (click)="open.set(!open())">
			{{ open() ? 'Hide' : 'Legend' }}
		</button>
		@if (open()) {
			@switch (store.mode()) {
				@case ('owner') {
					<div class="mb-1 font-semibold text-white">Owner at game start</div>
					<ul class="grid grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-2">
						@for (item of store.ownerLegend(); track item.id) {
							<li class="flex items-center gap-1.5">
								<span
									class="inline-block size-2.5 shrink-0 rounded-sm"
									[style.background]="item.color"
								></span>
								<span class="truncate">{{ item.name }}</span>
								<span class="text-slate-400">{{ item.count }}</span>
							</li>
						}
					</ul>
				}
				@case ('sunlight') {
					<div class="mb-1 font-semibold text-white">Sunlight (solar power output)</div>
					<div class="h-2.5 w-48 rounded-sm" [style.background]="gradients.sunlight"></div>
					<div class="flex w-48 justify-between text-slate-400">
						<span>0%</span><span>100%</span><span>200%+</span>
					</div>
				}
				@case ('security') {
					<div class="mb-1 font-semibold text-white">Security level</div>
					<div class="h-2.5 w-48 rounded-sm" [style.background]="gradients.security"></div>
					<div class="flex w-48 justify-between text-slate-400">
						<span>0%</span><span>50%</span><span>100%</span>
					</div>
				}
				@case ('resource') {
					<div class="mb-1 font-semibold text-white">{{ store.wareName(store.resource()) }} available</div>
					<div class="h-2.5 w-48 rounded-sm" [style.background]="gradients.resource"></div>
					<div class="flex w-48 justify-between text-slate-400"><span>little</span><span>a lot</span></div>
				}
			}
			<div class="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 border-t border-white/10 pt-1.5 text-slate-400">
				<span><span class="mr-1 inline-block h-0.5 w-4 bg-slate-200 align-middle"></span>Jump gate</span>
				<span
					><span class="mr-1 inline-block w-4 border-t-2 border-dashed border-amber-400 align-middle"></span
					>Accelerator</span
				>
				<span
					><span class="mr-1 inline-block w-4 border-t-2 border-dotted border-sky-400 align-middle"></span
					>Superhighway</span
				>
				@if (store.abandonedModel().show) {
					<span
						><span class="mr-1 inline-block size-2 rotate-45 bg-pink-400 align-middle"></span>Abandoned
						ship</span
					>
				}
				@if (store.route()) {
					<span><span class="mr-1 inline-block h-1 w-4 bg-yellow-300 align-middle"></span>Route</span>
				}
				@for (type of stationTypes; track type.id) {
					@if (store.stationsModel().types[type.id]) {
						<span
							><span
								class="mr-1 inline-block size-2.5 rounded-full align-middle"
								[style.background]="type.color"
							></span
							>{{ type.label }}</span
						>
					}
				}
			</div>
		}
	`,
})
export class MapLegendComponent {
	protected readonly store = inject(MapStore);
	protected readonly open = signal(true);
	protected readonly stationTypes = STATION_TYPES;
	protected readonly gradients = {
		sunlight: 'linear-gradient(to right, hsl(230 85% 22%), hsl(140 85% 43%), hsl(50 85% 65%))',
		security: 'linear-gradient(to right, hsl(0 75% 45%), hsl(60 75% 45%), hsl(120 75% 45%))',
		resource: 'linear-gradient(to right, rgb(20 184 166 / 0.2), rgb(20 184 166 / 0.95))',
	};
}
