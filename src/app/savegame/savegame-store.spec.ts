import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryKeyValueStore } from '../core/storage/key-value-store';
import { WorkerCancelled, WorkerTask } from '../core/workers/worker-task';
import { SavegameParser } from './parse-savegame';
import { ReadSavegameResult } from './read-savegame';
import { SavegameError, SavegameInfo, SavegameSummary } from './savegame-model';
import { SAVEGAME_REPOSITORY, SavegameRepository, createSavegameRepository } from './savegame-repository';
import { SAVEGAME_PARSER, SavegameStore } from './savegame-store';

function info(guid: string, savedAt: number): SavegameInfo {
	return {
		saveName: 'save',
		savedAt,
		gameVersion: 900,
		gameBuild: 1,
		originalVersion: 900,
		start: 'x',
		gameTime: 0,
		guid,
		playerName: 'p',
		money: 0,
		modified: false,
		extensions: [],
	};
}

function stored(id: string, savedAt: number, schemaVersion = 1): Omit<SavegameSummary, 'fileKept'> {
	return { id, schemaVersion, addedAt: 1, fileName: `${id}.xml.gz`, fileSize: 3, info: info(id, savedAt), data: { old: true } };
}

function result(guid: string, savedAt: number, extra: Partial<ReadSavegameResult> = {}): ReadSavegameResult {
	return { info: info(guid, savedAt), data: { fresh: true }, ...extra };
}

/** Announces the info first, then resolves with the outcome. */
function finishing(outcome: ReadSavegameResult | Error): SavegameParser {
	return (_file, callbacks) => {
		let reject: (e: unknown) => void = () => undefined;
		const promise = new Promise<ReadSavegameResult>((resolve, rej) => {
			reject = rej;
			void Promise.resolve().then(() => {
				if (outcome instanceof Error) {
					rej(outcome);
				} else {
					callbacks.onInfo?.(outcome.info);
					resolve(outcome);
				}
			});
		});
		const task: WorkerTask<ReadSavegameResult> = { result: promise, cancel: () => reject(new WorkerCancelled()) };
		return task;
	};
}

const hanging: SavegameParser = () => {
	let reject: (e: unknown) => void = () => undefined;
	const promise = new Promise<ReadSavegameResult>((_resolve, rej) => (reject = rej));
	return { result: promise, cancel: () => reject(new WorkerCancelled()) };
};

async function setup(parser: SavegameParser, seed: [Omit<SavegameSummary, 'fileKept'>, Blob | undefined][] = []) {
	const repository: SavegameRepository = createSavegameRepository(
		new MemoryKeyValueStore<SavegameSummary>(),
		new MemoryKeyValueStore<Blob>(),
		true,
	);
	for (const [summary, file] of seed) {
		await repository.save(summary, file);
	}
	TestBed.configureTestingModule({
		providers: [
			{ provide: SAVEGAME_REPOSITORY, useValue: () => Promise.resolve(repository) },
			{ provide: SAVEGAME_PARSER, useValue: parser },
		],
	});
	return { store: TestBed.inject(SavegameStore), repository };
}

const file = (name = 'a.xml.gz') => new File(['abc'], name);

describe('SavegameStore', () => {
	afterEach(() => localStorage.removeItem('activeSavegame'));

	it('adds a save and lists it', async () => {
		const { store } = await setup(finishing(result('g1', 100)));
		expect(await store.load(file())).toEqual({ status: 'added', id: 'g1' });
		expect(store.saves().map((s) => s.id)).toEqual(['g1']);
		expect(store.saves()[0].schemaVersion).toBe(1);
		expect(store.saves()[0].fileKept).toBe(true);
		expect(store.loading()).toBeNull();
	});

	it('replaces the entry for a newer save of the same playthrough and keeps it active', async () => {
		const { store, repository } = await setup(finishing(result('g1', 200)), [[stored('g1', 100), new Blob(['x'])]]);
		store.select('g1');
		expect(await store.load(file())).toEqual({ status: 'replaced', id: 'g1' });
		expect(store.saves()).toHaveLength(1);
		expect(store.saves()[0].info.savedAt).toBe(200);
		expect(store.activeId()).toBe('g1');
		expect((await repository.get('g1'))?.data).toEqual({ fresh: true });
		await vi.waitFor(() => expect(store.active()?.info.savedAt).toBe(200));
	});

	it('ignores an older save of a stored playthrough', async () => {
		const cancelSpy = vi.fn();
		const parser: SavegameParser = (f, c) => {
			const task = finishing(result('g1', 50))(f, c);
			return {
				result: task.result,
				cancel: () => {
					cancelSpy();
					task.cancel();
				},
			};
		};
		const { store, repository } = await setup(parser, [[stored('g1', 100), undefined]]);
		expect(await store.load(file())).toEqual({ status: 'older', id: 'g1' });
		expect(cancelSpy).toHaveBeenCalled();
		expect((await repository.get('g1'))?.info.savedAt).toBe(100);
		expect(store.saves()[0].info.savedAt).toBe(100);
	});

	it('adds a second playthrough as its own entry', async () => {
		const { store } = await setup(finishing(result('g2', 50)), [[stored('g1', 100), undefined]]);
		expect(await store.load(file())).toEqual({ status: 'added', id: 'g2' });
		expect(store.saves().map((s) => s.id)).toEqual(['g1', 'g2']);
	});

	it('refuses a second load while one is running', async () => {
		const { store } = await setup(hanging);
		const first = store.load(file());
		expect(store.loading()?.fileName).toBe('a.xml.gz');
		expect(await store.load(file('b.xml.gz'))).toEqual({ status: 'busy' });
		store.cancel();
		expect(await first).toEqual({ status: 'cancelled' });
	});

	it('reports parser errors', async () => {
		const { store } = await setup(finishing(new SavegameError('truncated', 'cut')));
		expect(await store.load(file())).toEqual({ status: 'error', code: 'truncated' });
		expect(store.saves()).toEqual([]);
		expect(store.loading()).toBeNull();
	});

	it('reports a distinct error when the read save cannot be stored', async () => {
		const { store, repository } = await setup(finishing(result('g1', 100)));
		vi.spyOn(repository, 'save').mockRejectedValue(new Error('quota'));
		expect(await store.load(file())).toEqual({ status: 'error', code: 'store-failed' });
		expect(store.saves()).toEqual([]);
		expect(store.loading()).toBeNull();
	});

	it('keeps the active save and the list when removing fails', async () => {
		const { store, repository } = await setup(hanging, [[stored('g1', 100), undefined]]);
		await vi.waitFor(() => expect(store.saves()).toHaveLength(1));
		store.select('g1');
		vi.spyOn(repository, 'remove').mockRejectedValue(new Error('blocked'));
		await expect(store.remove('g1')).rejects.toThrow('blocked');
		expect(store.activeId()).toBe('g1');
		expect(store.saves().map((s) => s.id)).toEqual(['g1']);
	});

	it('reports persistence as unknown until the repository is open', async () => {
		let open: (repository: SavegameRepository) => void = () => undefined;
		const ready = new Promise<SavegameRepository>((resolve) => (open = resolve));
		TestBed.configureTestingModule({
			providers: [
				{ provide: SAVEGAME_REPOSITORY, useValue: () => ready },
				{ provide: SAVEGAME_PARSER, useValue: hanging },
			],
		});
		const store = TestBed.inject(SavegameStore);
		await Promise.resolve();
		expect(store.persistent()).toBeNull();
		open(createSavegameRepository(new MemoryKeyValueStore<SavegameSummary>(), new MemoryKeyValueStore<Blob>(), false));
		await vi.waitFor(() => expect(store.persistent()).toBe(false));
	});

	it('cancel resolves the load as cancelled', async () => {
		const { store } = await setup(hanging);
		const pending = store.load(file());
		await Promise.resolve();
		store.cancel();
		expect(await pending).toEqual({ status: 'cancelled' });
		expect(store.loading()).toBeNull();
	});

	it('treats a stored active id that no longer exists as none', async () => {
		localStorage.setItem('activeSavegame', JSON.stringify('gone'));
		const { store } = await setup(hanging, [[stored('g1', 100), undefined]]);
		await vi.waitFor(() => expect(store.saves()).toHaveLength(1));
		expect(store.activeId()).toBeNull();
		expect(store.active()).toBeNull();
	});

	it('clears the active save when it is removed', async () => {
		const { store } = await setup(hanging, [[stored('g1', 100), undefined]]);
		await vi.waitFor(() => expect(store.saves()).toHaveLength(1));
		store.select('g1');
		await vi.waitFor(() => expect(store.active()?.id).toBe('g1'));
		await store.remove('g1');
		expect(store.activeId()).toBeNull();
		expect(store.active()).toBeNull();
		expect(store.saves()).toEqual([]);
	});

	it('re-reads outdated saves that kept their file', async () => {
		const blob = new Blob(['kept']);
		const parser = vi.fn(finishing(result('g1', 100)));
		const { store, repository } = await setup(parser, [[stored('g1', 100, 0), blob]]);
		await vi.waitFor(() => expect(store.saves()).toHaveLength(1));
		await vi.waitFor(() => expect(store.status('g1')).toBe('ok'));
		expect(parser.mock.calls[0][0]).toBe(blob);
		const updated = await repository.get('g1');
		expect(updated?.schemaVersion).toBe(1);
		expect(updated?.data).toEqual({ fresh: true });
		expect(updated?.fileKept).toBe(true);
	});

	it('marks outdated saves without a file as reload-needed', async () => {
		const parser = vi.fn(hanging);
		const { store } = await setup(parser, [[stored('g1', 100, 0), undefined]]);
		await vi.waitFor(() => expect(store.saves()).toHaveLength(1));
		expect(store.status('g1')).toBe('reload-needed');
		expect(parser).not.toHaveBeenCalled();
	});

	it('does not overwrite a newer save when loaded before the list is ready', async () => {
		const { store, repository } = await setup(finishing(result('g1', 50)), [[stored('g1', 100), undefined]]);
		expect(await store.load(file())).toEqual({ status: 'older', id: 'g1' });
		expect((await repository.get('g1'))?.info.savedAt).toBe(100);
	});

	it('does not overwrite a newer save when the parse finishes before cancel takes effect', async () => {
		const parser: SavegameParser = (f, c) => {
			const task = finishing(result('g1', 50))(f, c);
			return { result: task.result, cancel: () => undefined };
		};
		const { store, repository } = await setup(parser, [[stored('g1', 100), undefined]]);
		expect(await store.load(file())).toEqual({ status: 'older', id: 'g1' });
		expect((await repository.get('g1'))?.info.savedAt).toBe(100);
		expect((await repository.get('g1'))?.data).toEqual({ old: true });
	});
});
