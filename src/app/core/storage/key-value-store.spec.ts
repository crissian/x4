import { describe, expect, it } from 'vitest';
import { MemoryKeyValueStore } from './key-value-store';
import { openIndexedDb } from './indexed-db-store';

describe('MemoryKeyValueStore', () => {
	it('puts, gets, lists and deletes', async () => {
		const store = new MemoryKeyValueStore<number>();
		await store.put('a', 1);
		await store.put('b', 2);
		expect(await store.get('a')).toBe(1);
		expect(await store.get('x')).toBeUndefined();
		expect((await store.getAll()).sort()).toEqual([1, 2]);
		await store.delete('a');
		expect(await store.get('a')).toBeUndefined();
		expect(await store.getAll()).toEqual([2]);
	});
});

describe('openIndexedDb', () => {
	it('resolves null when IndexedDB is unavailable', async () => {
		expect(await openIndexedDb('test-db', 1, ['a'])).toBeNull();
	});
});
