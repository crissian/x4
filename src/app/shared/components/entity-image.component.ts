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
	templateUrl: './entity-image.component.html',
})
export class EntityImageComponent {
	readonly kind = input.required<EntityImageKind>();
	readonly id = input.required<string | null | undefined>();
	readonly alt = input('');

	protected readonly src = computed(() => entityImage(this.kind(), this.id()));
	protected readonly size = computed(() => sizes[this.kind()]);
}
