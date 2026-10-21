import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
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
	template: `
		<div class="card">
			<div class="card-header flex flex-wrap items-center justify-between gap-3">
				<span
					><a [routerLink]="sectionLink()">{{ section() }}</a> - {{ title() }}</span
				>
				<ng-content select="[actions]" />
			</div>
			<div class="card-body flow-root">
				@if (image(); as image) {
					<app-entity-image [kind]="image" [id]="id()" [alt]="title()" />
				}
				@if (shownDescription(); as description) {
					<p class="mb-3 max-w-4xl whitespace-pre-line">{{ description }}</p>
				}
				<ng-content />
			</div>
		</div>
	`,
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
		return description && description !== NO_DESCRIPTION ? description : undefined;
	});
}

/** A label / value pair inside a `<dl class="details">`: `<div appDetail="Speed">{{ speed }}</div>`. */
@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- a <div> keeps the <dt>/<dd> pair valid inside <dl>
	selector: 'div[appDetail]',
	host: { class: 'contents' },
	template: `
		<dt>{{ appDetail() }}</dt>
		<dd><ng-content /></dd>
	`,
})
export class DetailComponent {
	readonly appDetail = input.required<string>();
}
