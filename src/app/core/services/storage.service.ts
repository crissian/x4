import { Injectable } from '@angular/core';
import { LocalStorage } from './local-storage';

@Injectable({ providedIn: 'root' })
export class StorageService {
	add(key: string, value: unknown) {
		LocalStorage.write(key, value);
	}

	get<T>(key: string): T | null {
		return LocalStorage.read<T | null>(key, null);
	}

	delete(key: string) {
		LocalStorage.write(key, undefined);
	}

	clear() {
		try {
			localStorage.clear();
		} catch {
			// storage unavailable
		}
	}
}
