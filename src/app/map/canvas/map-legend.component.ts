import { Component, inject } from '@angular/core';
import { LocalStorage } from '../../core/services/local-storage';
import { MapStations } from '../map-stations';
import { MapStore } from '../map-store';
import { StationTypeBadgeComponent } from '../station-type-badge.component';

/** Collapsible legend of the sector colors, connections and markers. */
@Component({
	selector: 'app-map-legend',
	imports: [StationTypeBadgeComponent],
	templateUrl: './map-legend.component.html',
})
export class MapLegendComponent {
	protected readonly store = inject(MapStore);
	/** Remembered between visits; at first starts collapsed on narrow screens, where it would cover much of the map. */
	protected readonly open = LocalStorage.persistedSignal(
		'map-legend-open',
		!globalThis.matchMedia?.('(max-width: 639px)').matches,
		{
			parse: (value) => (typeof value === 'boolean' ? value : undefined),
		}
	);
	protected readonly hideLabel = $localize`Hide`;
	protected readonly legendLabel = $localize`Legend`;
	protected readonly stations = inject(MapStations);
	protected readonly gradients = {
		sunlight: 'linear-gradient(to right, hsl(230 85% 22%), hsl(140 85% 43%), hsl(50 85% 65%))',
		security: 'linear-gradient(to right, hsl(0 75% 45%), hsl(60 75% 45%), hsl(120 75% 45%))',
		resource: 'linear-gradient(to right, rgb(20 184 166 / 0.2), rgb(20 184 166 / 0.95))',
	};
}
