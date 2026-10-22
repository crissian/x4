import { DecimalPipe, PercentPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MapStore } from '../map-store';

/** Details of the sector under the pointer. */
@Component({
	selector: 'app-map-tooltip',
	imports: [DecimalPipe, PercentPipe],
	host: { class: 'contents' },
	template: `
		@if (store.hovered(); as hover) {
			@let sector = hover.shape.sector;
			<div
				class="pointer-events-none absolute z-10 w-64 rounded-md border border-white/15 bg-slate-900/95 p-2.5 text-xs text-slate-200 shadow-xl"
				[style.left.px]="hover.x + 16"
				[style.top.px]="hover.y + 16"
				[style.transform]="store.keepInside(hover.x, hover.y)"
			>
				<div class="text-sm font-semibold text-white">{{ sector.name }}</div>
				@if (hover.shape.cluster.sectors.length > 1) {
					<div class="text-slate-400" i18n>{{ hover.shape.cluster.name }} system</div>
				}
				<dl class="mt-1.5 grid grid-cols-[5.5rem_1fr] gap-y-0.5">
					<dt class="text-slate-400" i18n>Owner</dt>
					<dd>
						@if (faction(); as faction) {
							<span
								class="mr-1 inline-block size-2 rounded-full"
								[style.background]="faction.color"
							></span
							>{{ faction.name }}
						} @else {
							<ng-container i18n>Unclaimed</ng-container>
						}
					</dd>
					<dt class="text-slate-400" i18n>Sunlight</dt>
					<dd>{{ sector.sunlight != null ? (sector.sunlight | percent) : '-' }}</dd>
					<dt class="text-slate-400" i18n>Security</dt>
					<dd>{{ sector.security != null ? (sector.security | percent) : '-' }}</dd>
					<dt class="text-slate-400" i18n>Economy</dt>
					<dd>{{ sector.economy != null ? (sector.economy | percent) : '-' }}</dd>
					<dt class="text-slate-400" i18n>Resources</dt>
					<dd>{{ store.resourceNames(sector) || '-' }}</dd>
					@if (store.mode() === 'resource') {
						<dt class="text-slate-400">{{ store.wareName(store.resource()) }}</dt>
						<dd>{{ store.resourceAmount(sector) | number }}</dd>
					}
				</dl>
				<div class="mt-1.5 text-slate-500" i18n>Click for details, right-click to plan a route</div>
			</div>
		}
	`,
})
export class MapTooltipComponent {
	protected readonly store = inject(MapStore);
	protected readonly faction = computed(() => this.store.faction(this.store.hovered()?.shape.sector.owner));
}

/** Right-click menu of a sector. */
@Component({
	selector: 'app-map-menu',
	host: { class: 'contents' },
	template: `
		@if (store.menu(); as menu) {
			<div
				class="absolute z-20 w-48 overflow-hidden rounded-md border border-white/15 bg-slate-900/95 text-sm text-slate-200 shadow-xl"
				[style.left.px]="menu.x + 4"
				[style.top.px]="menu.y + 4"
				[style.transform]="store.keepInside(menu.x, menu.y)"
				(pointerdown)="$event.stopPropagation()"
				(pointerup)="$event.stopPropagation()"
			>
				<div class="border-b border-white/10 px-3 py-1.5 font-semibold text-white">{{ menu.sector.name }}</div>
				<button
					type="button"
					class="block w-full px-3 py-1.5 text-left hover:bg-white/10"
					(click)="action('from')"
					i18n
				>
					Route from here
				</button>
				<button
					type="button"
					class="block w-full px-3 py-1.5 text-left hover:bg-white/10"
					(click)="action('to')"
					i18n
				>
					Route to here
				</button>
				<button
					type="button"
					class="block w-full px-3 py-1.5 text-left hover:bg-white/10"
					(click)="action('open')"
					i18n
				>
					Sector details
				</button>
			</div>
		}
	`,
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
