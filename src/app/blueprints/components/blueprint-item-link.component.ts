import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlueprintCatalog } from '../blueprint-catalog';
import type { BlueprintItem } from '../blueprint-model';

/** The name of a blueprint's module, ship or equipment, linked to its detail page. */
@Component({
	selector: 'app-blueprint-item-link',
	imports: [RouterLink],
	templateUrl: './blueprint-item-link.component.html',
})
export class BlueprintItemLinkComponent {
	readonly item = input.required<BlueprintItem>();

	protected readonly link = computed(() => BlueprintCatalog.link(this.item()));
}
