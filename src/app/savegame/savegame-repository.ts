import { InjectionToken } from '@angular/core';
import { IndexedDb, IndexedDbStore } from '../core/storage/indexed-db-store';
import { KeyValueStore, MemoryKeyValueStore } from '../core/storage/key-value-store';
import { SavegameListItem, SavegameSummary } from './savegame-model';

export class SavegameRepository {
	constructor(
		private readonly summaries: KeyValueStore<SavegameListItem>,
		private readonly dataStore: KeyValueStore<Record<string, unknown>>,
		private readonly files: KeyValueStore<Blob>,
		readonly persistent: boolean,
	) {}

	/** IndexedDB 'x4-savegames' v2, stores 'saves', 'data' and 'files'; falls back to memory stores with persistent=false */
	static async open(): Promise<SavegameRepository> {
		const db = await IndexedDb.open('x4-savegames', 2, ['saves', 'data', 'files'], SavegameRepository.upgrade);
		if (!db) {
			return new SavegameRepository(
				new MemoryKeyValueStore<SavegameListItem>(),
				new MemoryKeyValueStore<Record<string, unknown>>(),
				new MemoryKeyValueStore<Blob>(),
				false,
			);
		}
		return new SavegameRepository(
			new IndexedDbStore<SavegameListItem>(db, 'saves'),
			new IndexedDbStore<Record<string, unknown>>(db, 'data'),
			new IndexedDbStore<Blob>(db, 'files'),
			true,
		);
	}

	/** Splits a record into the list item and its data (`{}` when the record has none). */
	static moveSummaryData(record: SavegameSummary): { summary: SavegameListItem; data: Record<string, unknown> } {
		const { data, ...summary } = record;
		return { summary, data: data ?? {} };
	}

	/** Version 1 kept the data inside each 'saves' record: moves it to the 'data' store within the upgrade transaction. */
	private static upgrade(_db: IDBDatabase, tx: IDBTransaction, oldVersion: number) {
		if (oldVersion !== 1) {
			return;
		}
		const data = tx.objectStore('data');
		const request = tx.objectStore('saves').openCursor();
		request.onsuccess = () => {
			const cursor = request.result;
			if (!cursor) {
				return;
			}
			const moved = SavegameRepository.moveSummaryData(cursor.value as SavegameSummary);
			data.put(moved.data, cursor.key);
			cursor.update(moved.summary);
			cursor.continue();
		};
	}

	/** newest savedAt first, without data */
	async list(): Promise<SavegameListItem[]> {
		const all = await this.summaries.getAll();
		return all.sort((a, b) => b.info.savedAt - a.info.savedAt);
	}

	async get(id: string): Promise<SavegameSummary | undefined> {
		const summary = await this.summaries.get(id);
		if (!summary) {
			return undefined;
		}
		return { ...summary, data: (await this.dataStore.get(id)) ?? {} };
	}

	getFile(id: string): Promise<Blob | undefined> {
		return this.files.get(id);
	}

	/** stores summary; stores file when given; on file failure keeps summary with fileKept=false */
	async save(summary: Omit<SavegameSummary, 'fileKept'>, file: Blob | undefined): Promise<SavegameSummary> {
		let fileKept = false;
		const previousFile = await this.files.get(summary.id).catch(() => undefined);
		if (file) {
			try {
				await this.files.put(summary.id, file);
				fileKept = true;
			} catch {
				fileKept = false;
			}
		}
		if (!fileKept) {
			// never leave a previous save's blob behind a summary that says no file is kept
			await this.dropFile(summary.id);
		}
		const stored: SavegameSummary = { ...summary, fileKept };
		const { summary: item, data } = SavegameRepository.moveSummaryData(stored);
		const previousData = await this.dataStore.get(stored.id).catch(() => undefined);
		try {
			await this.dataStore.put(stored.id, data);
			await this.summaries.put(stored.id, item);
		} catch (error) {
			await (previousData ? this.dataStore.put(stored.id, previousData) : this.dataStore.delete(stored.id)).catch(() => undefined);
			if (previousFile) {
				await this.files.put(stored.id, previousFile).catch(() => undefined);
			} else if (fileKept) {
				await this.dropFile(stored.id);
			}
			throw error;
		}
		return stored;
	}

	async remove(id: string): Promise<void> {
		await this.files.delete(id);
		await this.dataStore.delete(id);
		await this.summaries.delete(id);
	}

	private async dropFile(id: string): Promise<void> {
		try {
			await this.files.delete(id);
		} catch {
			// nothing more to do: the summary says fileKept=false
		}
	}
}

export const SAVEGAME_REPOSITORY = new InjectionToken<() => Promise<SavegameRepository>>('savegameRepository', {
	factory: () => SavegameRepository.open,
});
