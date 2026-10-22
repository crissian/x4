import { Component, input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import type { StationTypeInfo } from '../shared/services/constants';
import { StationMarkersComponent } from './canvas/station-markers';
import { StationIcons } from './station-icons';

/** The station type icon in a circle of the type's colour, as drawn on the map. */
@Component({
	selector: 'app-station-type-badge',
	imports: [LucideDynamicIcon],
	templateUrl: './station-type-badge.component.html',
})
export class StationTypeBadgeComponent {
	readonly type = input.required<StationTypeInfo>();

	protected readonly icons = StationIcons;
	protected readonly dark = StationMarkersComponent.DARK;
}
