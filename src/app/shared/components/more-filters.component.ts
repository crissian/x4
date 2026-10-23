import { Component, computed, effect, input, signal, untracked } from '@angular/core';
import { LucideChevronDown, LucideChevronRight } from '@lucide/angular';
import { LocalStorage } from '../../core/services/local-storage';

/**
 * A "More filters" toggle around the less used filters of a page. Closed by default; whether it is open is
 * remembered under `storageKey`. It opens by itself when one of its filters is set (`active`, such as from the URL),
 * and shows how many are set while closed.
 */
@Component({
	selector: 'app-more-filters',
	imports: [LucideChevronDown, LucideChevronRight],
	templateUrl: './more-filters.component.html',
})
export class MoreFiltersComponent {
	readonly storageKey = input.required<string>();
	/** how many of the filters inside are not at their default */
	readonly active = input(0);

	/** The choice made on this page, undefined until the toggle is used (or a filter inside was set since). */
	private readonly chosen = signal<boolean | undefined>(undefined);
	private readonly stored = computed(() =>
		LocalStorage.read(this.storageKey(), false, (x) => (typeof x === 'boolean' ? x : undefined))
	);
	protected readonly open = computed(() => this.chosen() ?? (this.stored() || this.active() > 0));
	protected readonly id = computed(() => `${this.storageKey()}-panel`);

	constructor() {
		// a filter inside set again (such as by a URL change) opens the panel over an earlier close
		effect(() => {
			if (this.active() > 0) {
				untracked(() => this.chosen.update((x) => (x === false ? undefined : x)));
			}
		});
	}

	protected toggle() {
		const next = !this.open();
		this.chosen.set(next);
		LocalStorage.write(this.storageKey(), next);
	}
}
