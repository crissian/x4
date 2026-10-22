export interface KeyValueStore<T> {
	get(key: string): Promise<T | undefined>;
	getAll(): Promise<T[]>;
	put(key: string, value: T): Promise<void>;
	delete(key: string): Promise<void>;
}

export class MemoryKeyValueStore<T> implements KeyValueStore<T> {
	private readonly items = new Map<string, T>();

	get(key: string): Promise<T | undefined> {
		return Promise.resolve(this.items.get(key));
	}

	getAll(): Promise<T[]> {
		return Promise.resolve([...this.items.values()]);
	}

	put(key: string, value: T): Promise<void> {
		this.items.set(key, value);
		return Promise.resolve();
	}

	delete(key: string): Promise<void> {
		this.items.delete(key);
		return Promise.resolve();
	}
}
