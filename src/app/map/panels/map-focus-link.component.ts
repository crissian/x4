import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Sector } from '../../shared/services/model/model';

/** Sector name that selects the sector on the map and centers the view on it. */
@Component({
	selector: 'app-map-focus-link',
	imports: [RouterLink],
	template: `
		<a [routerLink]="[]" [queryParams]="{ sector: sector().id }" queryParamsHandling="merge" [replaceUrl]="true">{{
			sector().name
		}}</a>
	`,
})
export class MapFocusLinkComponent {
	readonly sector = input.required<Sector>();
}
