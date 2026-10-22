import { KeyValueStore } from './key-value-store';

export class IndexedDb {
	/**
	 * Opens (and creates) the database with the given object stores; resolves null when IndexedDB is unavailable or fails to open.
	 * `upgrade` runs inside the versionchange transaction after the missing stores were created.
	 */
	static open(
		name: string,
		version: number,
		stores: string[],
		upgrade?: (db: IDBDatabase, tx: IDBTransaction, oldVersion: number) => void,
	): Promise<IDBDatabase | null> {
		try {
			if (typeof indexedDB === 'undefined') {
				return Promise.resolve(null);
			}
			const req = indexedDB.open(name, version);
			return new Promise((resolve) => {
				let settled = false;
				const settle = (db: IDBDatabase | null) => {
					if (settled) {
						// the caller already got null (blocked): do not keep the late connection open
						db?.close();
						return;
					}
					settled = true;
					resolve(db);
				};
				req.onupgradeneeded = (event) => {
					for (const store of stores) {
						if (!req.result.objectStoreNames.contains(store)) {
							req.result.createObjectStore(store);
						}
					}
					if (req.transaction) {
						upgrade?.(req.result, req.transaction, event.oldVersion);
					}
				};
				req.onsuccess = () => {
					req.result.onversionchange = () => req.result.close();
					settle(req.result);
				};
				req.onerror = () => settle(null);
				req.onblocked = () => settle(null);
			});
		} catch {
			return Promise.resolve(null);
		}
	}
}

export class IndexedDbStore<T> implements KeyValueStore<T> {
	constructor(
		private readonly db: IDBDatabase,
		private readonly store: string,
	) {}

	get(key: string): Promise<T | undefined> {
		return this.read<T | undefined>((store) => store.get(key));
	}

	getAll(): Promise<T[]> {
		return this.read<T[]>((store) => store.getAll());
	}

	async put(key: string, value: T): Promise<void> {
		await this.run('readwrite', (store) => store.put(value, key), true);
	}

	async delete(key: string): Promise<void> {
		await this.run('readwrite', (store) => store.delete(key), true);
	}

	private read<R>(action: (store: IDBObjectStore) => IDBRequest<R>): Promise<R> {
		return this.run('readonly', action, false);
	}

	/** never throws synchronously; writes resolve when the transaction commits, so quota errors surface as rejections */
	private run<R>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<R>, untilComplete: boolean): Promise<R> {
		return new Promise((resolve, reject) => {
			try {
				const tx = this.db.transaction(this.store, mode);
				const req = action(tx.objectStore(this.store));
				const fail = (event: Event) => reject(tx.error ?? (event.target as IDBRequest | null)?.error ?? new Error('IndexedDB request failed'));
				tx.onerror = fail;
				tx.onabort = fail;
				if (untilComplete) {
					tx.oncomplete = () => resolve(req.result);
				} else {
					req.onsuccess = () => resolve(req.result);
				}
			} catch (error) {
				reject(error);
			}
		});
	}
}
