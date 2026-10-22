import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameText } from '../../core/game-text';
import { EntityImageKind } from '../services/data/images-data';
import { EntityImageComponent } from './entity-image.component';

const NO_DESCRIPTION = 'No information available';

/**
 * Frame of an entity detail page: breadcrumb header with optional `[actions]`, the encyclopedia
 * render and description, followed by the projected content.
 */
@Component({
	selector: 'app-detail-page',
	imports: [RouterLink, EntityImageComponent],
	templateUrl: './detail-page.component.html',
})
export class DetailPageComponent {
	/** Name of the list page shown in the breadcrumb. */
	readonly section = input.required<string>();
	readonly sectionLink = input.required<string>();
	readonly title = input.required<string>();
	readonly id = input<string>();
	readonly image = input<EntityImageKind>();
	readonly description = input<string>();

	protected readonly shownDescription = computed(() => {
		const description = this.description();
		return description && description !== GameText.get(NO_DESCRIPTION) ? description : undefined;
	});
}

/** A label / value pair inside a `<dl class="details">`: `<div appDetail="Speed">{{ speed }}</div>`. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- a <div> keeps the <dt>/<dd> pair valid inside <dl>
	selector: 'div[appDetail]',
	templateUrl: './detail.component.html',
})
export class DetailComponent {
	readonly appDetail = input.required<string>();
}
