import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** A link to an entity's detail page under `route`, such as `/races`; "-" without an entity. */
@Component({
	selector: 'app-entity-link',
	imports: [RouterLink],
	templateUrl: './entity-link.component.html',
})
export class EntityLinkComponent {
	readonly route = input.required<string>();
	readonly entity = input<{ id: string; name: string } | null>();
}
