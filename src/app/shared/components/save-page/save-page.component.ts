import { Component, TemplateRef, contentChild, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ActiveSaveStatus } from '../../../savegame/active-save';
import { ExperimentalBadgeComponent } from '../experimental-badge.component';
import { TemplateSlotDirective } from '../template-slot.directive';

/**
 * Frame of a page that reads the active save: a card with the heading, then the page's `<ng-template>` once the
 * save is ready, a reload link, a loading note, or without a save the projected `[intro]` and a link to load one.
 * The page content is a template so it is only created once the save is ready.
 */
@Component({
	selector: 'app-save-page',
	imports: [ExperimentalBadgeComponent, RouterLink, TemplateSlotDirective],
	templateUrl: './save-page.component.html',
})
export class SavePageComponent {
	readonly heading = input.required<string>();
	readonly status = input.required<ActiveSaveStatus>();
	/** The text of the link to the saves page when the save must be loaded again. */
	readonly reloadText = input.required<string>();
	readonly experimental = input(true);

	protected readonly content = contentChild.required(TemplateRef);
}
