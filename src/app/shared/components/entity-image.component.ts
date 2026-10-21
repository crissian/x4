import { Component, computed, input } from '@angular/core';
import { entityImage, EntityImageKind } from '../services/data/images-data';

const sizes: Record<EntityImageKind, { width: number; height: number }> = {
	ships: { width: 256, height: 256 },
	modules: { width: 256, height: 256 },
	equipment: { width: 256, height: 256 },
	wares: { width: 128, height: 128 },
	sectors: { width: 512, height: 320 },
};

/** In-game encyclopedia render of an entity, floated next to the description; renders nothing when the game has none. */
@Component({
	selector: 'app-entity-image',
	host: { class: 'contents' },
	template: `
		@if (src(); as src) {
			<img
				[src]="src"
				[alt]="alt()"
				[width]="size().width"
				[height]="size().height"
				loading="lazy"
				decoding="async"
				class="mx-auto mb-3 block h-auto rounded border border-line sm:float-right sm:mb-2 sm:ml-4"
				[class]="frameClass()"
			/>
		}
	`,
})
export class EntityImageComponent {
	readonly kind = input.required<EntityImageKind>();
	readonly id = input.required<string | null | undefined>();
	readonly alt = input('');

	protected readonly src = computed(() => entityImage(this.kind(), this.id()));
	protected readonly size = computed(() => sizes[this.kind()]);
	protected readonly frameClass = computed(() => {
		switch (this.kind()) {
			case 'sectors':
				return 'w-full max-w-md sm:w-80 lg:w-96';
			case 'wares':
				// The ware icons are white glyphs on a transparent background
				return 'w-24 bg-neutral-800 p-2';
			default:
				// Renders have a transparent background, the dark frame matches the in-game encyclopedia
				return 'w-full max-w-64 bg-neutral-900 sm:w-56 lg:w-64';
		}
	});
}
