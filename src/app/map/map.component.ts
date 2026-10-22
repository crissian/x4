import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { LucideX } from '@lucide/angular';
import { GAME_VERSIONS } from '../shared/services/constants';
import { MapCanvasComponent } from './canvas/map-canvas.component';
import { MAP_PROVIDERS } from './map-providers';
import { MapStore, PanelTab } from './map-store';
import { MapSaveLayer } from './save/map-save-layer';
import { MapAbandonedPanelComponent } from './panels/map-abandoned-panel.component';
import { MapMiningPanelComponent } from './panels/map-mining-panel.component';
import { MapRoutePanelComponent } from './panels/map-route-panel.component';
import { MapStationsPanelComponent } from './panels/map-stations-panel.component';

/** Galaxy map page: map settings, the map and the side panel tabs. */
@Component({
	selector: 'app-map',
	imports: [
		FormField,
		LucideX,
		MapCanvasComponent,
		MapRoutePanelComponent,
		MapMiningPanelComponent,
		MapStationsPanelComponent,
		MapAbandonedPanelComponent,
		RouterLink,
	],
	providers: MAP_PROVIDERS,
	templateUrl: './map.component.html',
})
export default class MapComponent {
	private readonly router = inject(Router);
	protected readonly store = inject(MapStore);
	protected readonly save = inject(MapSaveLayer);

	/** Sector to highlight, from the `?sector=` query parameter. */
	readonly sector = input<string>();
	/** Route start and destination, from the `?from=` and `?to=` query parameters. */
	readonly from = input<string>();
	readonly to = input<string>();

	protected readonly gameVersions = GAME_VERSIONS;
	protected readonly versionsOpen = signal(false);
	protected readonly tabs: { id: PanelTab; label: string }[] = [
		{ id: 'route', label: $localize`Route` },
		{ id: 'mining', label: $localize`Mining` },
		{ id: 'stations', label: $localize`Stations` },
		{ id: 'abandoned', label: $localize`Abandoned` },
	];

	constructor() {
		effect(() => {
			const id = this.sector();
			untracked(() => (id ? this.store.focus(id) : this.store.selected.set(undefined)));
		});

		effect(() => {
			const from = this.from();
			const to = this.to();
			untracked(() => {
				if (from) {
					this.store.setRouteFrom(from);
				}
				if (to) {
					this.store.setRouteTo(to);
				}
				if (from || to) {
					this.store.tab.set('route');
				}
			});
		});

		// picking a sector name in the search box selects it
		effect(() => {
			const sector = this.store.sectorByName(this.store.settings().search);
			if (sector && sector.id !== untracked(this.store.selected)) {
				untracked(() => this.router.navigate([], { queryParams: { sector: sector.id }, replaceUrl: true }));
			}
		});
	}

	protected selectTab(tab: PanelTab) {
		this.store.tab.set(tab);
		if (tab === 'mining') {
			this.store.settings.update((settings) => ({ ...settings, mode: 'resource' }));
		}
	}

	protected clearSelection() {
		this.store.settings.update((settings) => ({ ...settings, search: '' }));
		this.router.navigate([], { queryParams: {}, replaceUrl: true });
	}
}
