import { Signal, computed, effect, signal, untracked } from '@angular/core';

/**
 * A value loaded once on demand, typically through a dynamic `import()`: loading starts the first time `when`
 * gives true. Create it in an injection context.
 */
export class LazyValue<T> {
	private static readonly loading = new Set<Promise<unknown>>();

	private readonly state = signal<{ value?: T; failed: boolean }>({ failed: false });
	private started = false;

	/** undefined until loaded */
	readonly value: Signal<T | undefined> = computed(() => this.state().value);
	readonly failed: Signal<boolean> = computed(() => this.state().failed);

	constructor(when: () => boolean, loader: () => Promise<T>) {
		effect(() => {
			if (when() && !this.started) {
				this.started = true;
				const load = untracked(loader).then(
					(value) => this.state.set({ value, failed: false }),
					() => this.state.set({ failed: true })
				);
				LazyValue.loading.add(load);
				void load.finally(() => LazyValue.loading.delete(load));
			}
		});
	}

	/** Resolves once no value is loading; tests run pending effects first (`TestBed.tick()`). */
	static async settled(): Promise<void> {
		while (LazyValue.loading.size) {
			await Promise.all([...LazyValue.loading]);
		}
	}
}
