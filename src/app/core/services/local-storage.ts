import { WritableSignal, effect, signal } from '@angular/core';

export interface PersistedOptions<T> {
	/** Validates or converts the stored JSON; return undefined to use the default. */
	parse?: (value: unknown) => T | undefined;
	/** Converts the value before storing it (e.g. a Set to an array). */
	serialize?: (value: T) => unknown;
}

/**
 * Safe access to local storage: it can be missing or throw (private windows, blocked site data),
 * so every read falls back to a default and every write is best effort.
 */
export class LocalStorage {
	static read<T>(key: string, fallback: T, parse: (value: unknown) => T | undefined = (x) => x as T): T {
		try {
			const json = localStorage.getItem(key);
			if (json == null) {
				return fallback;
			}
			return parse(JSON.parse(json)) ?? fallback;
		} catch {
			return fallback;
		}
	}

	static write(key: string, value: unknown) {
		try {
			if (value === undefined) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, JSON.stringify(value));
			}
		} catch {
			// storage unavailable: the value is kept for this page only
		}
	}

	/** A signal that starts from local storage and writes every change back. Needs an injection context. */
	static persistedSignal<T>(key: string, initial: T, options: PersistedOptions<T> = {}): WritableSignal<T> {
		const value = signal(LocalStorage.read(key, initial, options.parse));
		effect(() => {
			const current = value();
			LocalStorage.write(key, options.serialize ? options.serialize(current) : current);
		});
		return value;
	}

	/**
	 * Checkbox ticks by key, e.g. the vaults found: stored as the list of the keys that differ from `byDefault`, so
	 * keys added later start at the default. Needs an injection context.
	 */
	static persistedTicks<K extends string | number>(
		key: string,
		keys: readonly K[],
		byDefault: boolean
	): WritableSignal<Record<K, boolean>> {
		return LocalStorage.persistedSignal(key, LocalStorage.ticks(keys, byDefault), {
			parse: (value) => (Array.isArray(value) ? LocalStorage.ticks(keys, byDefault, value) : undefined),
			serialize: (value) => keys.filter((x) => value[x] !== byDefault),
		});
	}

	/** Every key at `byDefault`, except the `changed` ones. */
	static ticks<K extends string | number>(
		keys: readonly K[],
		byDefault: boolean,
		changed: readonly unknown[] = []
	): Record<K, boolean> {
		return Object.fromEntries(keys.map((x) => [x, changed.includes(x) !== byDefault])) as Record<K, boolean>;
	}
}
