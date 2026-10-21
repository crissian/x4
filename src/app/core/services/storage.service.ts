import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
	add(key: string, value: unknown) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	get<T>(key: string): T | null {
		const json = localStorage.getItem(key);
		if (json) {
			return JSON.parse(json);
		}
		return null;
	}

	delete(key: string) {
		localStorage.removeItem(key);
	}

	clear() {
		localStorage.clear();
	}
}
