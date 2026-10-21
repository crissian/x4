import { Injectable } from '@angular/core';
import { readStorage, writeStorage } from './local-storage';

@Injectable({ providedIn: 'root' })
export class StorageService {
	add(key: string, value: unknown) {
		writeStorage(key, value);
	}

	get<T>(key: string): T | null {
		return readStorage<T | null>(key, null);
	}

	delete(key: string) {
		writeStorage(key, undefined);
	}

	clear() {
		try {
			localStorage.clear();
		} catch {
			// storage unavailable
		}
	}
}
