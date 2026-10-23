import { Signal, computed, signal } from '@angular/core';

/** The first rows of a long list, with a toggle to show them all; for cards that would push the rest of a page down. */
export class ListLimit<T> {
	readonly expanded = signal(false);
	/** Rows left out while collapsed; 0 when the list fits. */
	readonly hiddenCount = computed(() => Math.max(0, this.items().length - this.limit));
	readonly visible = computed(() => (this.expanded() ? this.items() : this.items().slice(0, this.limit)));

	constructor(
		private readonly items: Signal<readonly T[]>,
		readonly limit: number
	) {}

	toggle() {
		this.expanded.update((x) => !x);
	}
}
