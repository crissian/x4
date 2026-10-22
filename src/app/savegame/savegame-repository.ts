import { InjectionToken } from '@angular/core';
import { IndexedDbStore, openIndexedDb } from '../core/storage/indexed-db-store';
import { KeyValueStore, MemoryKeyValueStore } from '../core/storage/key-value-store';
import { SavegameListItem, SavegameSummary } from './savegame-model';

export interface SavegameRepository {
	readonly persistent: boolean;
	/** newest savedAt first, without data */
	list(): Promise<SavegameListItem[]>;
	get(id: string): Promise<SavegameSummary | undefined>;
	getFile(id: string): Promise<Blob | undefined>;
	/** stores summary; stores file when given; on file failure keeps summary with fileKept=false */
	save(summary: Omit<SavegameSummary, 'fileKept'>, file: Blob | undefined): Promise<SavegameSummary>;
	remove(id: string): Promise<void>;
}

export function createSavegameRepository(
	summaries: KeyValueStore<SavegameSummary>,
	files: KeyValueStore<Blob>,
	persistent: boolean,
): SavegameRepository {
	const dropFile = async (id: string) => {
		try {
			await files.delete(id);
		} catch {
			// nothing more to do: the summary says fileKept=false
		}
	};
	return {
		persistent,
		async list() {
			const all = await summaries.getAll();
			return all
				.sort((a, b) => b.info.savedAt - a.info.savedAt)
				.map((summary) => {
					const item: Partial<SavegameSummary> = { ...summary };
					delete item.data;
					return item as SavegameListItem;
				});
		},
		get: (id) => summaries.get(id),
		getFile: (id) => files.get(id),
		async save(summary, file) {
			let fileKept = false;
			if (file) {
				try {
					await files.put(summary.id, file);
					fileKept = true;
				} catch {
					fileKept = false;
				}
			}
			if (!fileKept) {
				// never leave a previous save's blob behind a summary that says no file is kept
				await dropFile(summary.id);
			}
			const stored: SavegameSummary = { ...summary, fileKept };
			try {
				await summaries.put(stored.id, stored);
			} catch (error) {
				if (fileKept) {
					await dropFile(summary.id);
				}
				throw error;
			}
			return stored;
		},
		async remove(id) {
			await files.delete(id);
			await summaries.delete(id);
		},
	};
}

/** IndexedDB 'x4-savegames' v1, stores 'saves' and 'files'; falls back to memory stores with persistent=false */
export async function openSavegameRepository(): Promise<SavegameRepository> {
	const db = await openIndexedDb('x4-savegames', 1, ['saves', 'files']);
	if (!db) {
		return createSavegameRepository(new MemoryKeyValueStore<SavegameSummary>(), new MemoryKeyValueStore<Blob>(), false);
	}
	return createSavegameRepository(new IndexedDbStore<SavegameSummary>(db, 'saves'), new IndexedDbStore<Blob>(db, 'files'), true);
}

export const SAVEGAME_REPOSITORY = new InjectionToken<() => Promise<SavegameRepository>>('savegameRepository', {
	factory: () => openSavegameRepository,
});
