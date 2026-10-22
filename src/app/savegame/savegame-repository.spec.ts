import { describe, expect, it } from 'vitest';
import { KeyValueStore, MemoryKeyValueStore } from '../core/storage/key-value-store';
import { SavegameInfo, SavegameSummary } from './savegame-model';
import { createSavegameRepository } from './savegame-repository';

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

function summary(id: string, savedAt: number): Omit<SavegameSummary, 'fileKept'> {
	return { id, schemaVersion: 1, addedAt: 1, fileName: `${id}.xml.gz`, fileSize: 3, info: info(id, savedAt), data: { a: 1 } };
}

function repo(files: KeyValueStore<Blob> = new MemoryKeyValueStore<Blob>()) {
	return createSavegameRepository(new MemoryKeyValueStore<SavegameSummary>(), files, true);
}

describe('SavegameRepository', () => {
	it('lists newest save first without data', async () => {
		const r = repo();
		await r.save(summary('old', 100), undefined);
		await r.save(summary('new', 200), undefined);
		const list = await r.list();
		expect(list.map((s) => s.id)).toEqual(['new', 'old']);
		expect('data' in list[0]).toBe(false);
	});

	it('stores the file and marks it kept', async () => {
		const r = repo();
		const saved = await r.save(summary('a', 1), new Blob(['abc']));
		expect(saved.fileKept).toBe(true);
		expect((await r.get('a'))?.fileKept).toBe(true);
		expect(await (await r.getFile('a'))?.text()).toBe('abc');
	});

	it('keeps the summary when the file cannot be stored', async () => {
		const files = new MemoryKeyValueStore<Blob>();
		files.put = () => Promise.reject(new DOMException('full', 'QuotaExceededError'));
		const r = repo(files);
		const saved = await r.save(summary('a', 1), new Blob(['abc']));
		expect(saved.fileKept).toBe(false);
		expect((await r.get('a'))?.fileKept).toBe(false);
		expect(await r.getFile('a')).toBeUndefined();
	});

	it('stores no file when none is given', async () => {
		const r = repo();
		const saved = await r.save(summary('a', 1), undefined);
		expect(saved.fileKept).toBe(false);
		expect(await r.getFile('a')).toBeUndefined();
	});

	it('removes summary and file', async () => {
		const r = repo();
		await r.save(summary('a', 1), new Blob(['abc']));
		await r.remove('a');
		expect(await r.get('a')).toBeUndefined();
		expect(await r.getFile('a')).toBeUndefined();
	});

	it('drops the previous file when the new one cannot be stored', async () => {
		const files = new MemoryKeyValueStore<Blob>();
		const r = repo(files);
		await r.save(summary('a', 1), new Blob(['old']));
		files.put = () => Promise.reject(new DOMException('full', 'QuotaExceededError'));
		const saved = await r.save(summary('a', 1), new Blob(['new']));
		expect(saved.fileKept).toBe(false);
		expect(await r.getFile('a')).toBeUndefined();
	});

	it('drops the previous file when re-saved without one', async () => {
		const r = repo();
		await r.save(summary('a', 1), new Blob(['old']));
		await r.save(summary('a', 1), undefined);
		expect(await r.getFile('a')).toBeUndefined();
	});

	it('drops the new file when the summary cannot be stored', async () => {
		const files = new MemoryKeyValueStore<Blob>();
		const saves = new MemoryKeyValueStore<SavegameSummary>();
		saves.put = () => Promise.reject(new Error('boom'));
		const r = createSavegameRepository(saves, files, true);
		await expect(r.save(summary('a', 1), new Blob(['x']))).rejects.toThrow('boom');
		expect(await files.get('a')).toBeUndefined();
	});
});
