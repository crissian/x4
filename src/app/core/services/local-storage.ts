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
}
