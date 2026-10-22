import { describe, expect, it, vi } from 'vitest';
import { KeyValueStore, MemoryKeyValueStore } from '../core/storage/key-value-store';
import { SavegameInfo, SavegameListItem, SavegameSummary } from './savegame-model';
import { SavegameRepository } from './savegame-repository';

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
	return new SavegameRepository(new MemoryKeyValueStore<SavegameListItem>(), new MemoryKeyValueStore<Record<string, unknown>>(), files, true);
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
		const data = new MemoryKeyValueStore<Record<string, unknown>>();
		const saves = new MemoryKeyValueStore<SavegameListItem>();
		saves.put = () => Promise.reject(new Error('boom'));
		const r = new SavegameRepository(saves, data, files, true);
		await expect(r.save(summary('a', 1), new Blob(['x']))).rejects.toThrow('boom');
		expect(await files.get('a')).toBeUndefined();
		expect(await data.get('a')).toBeUndefined();
	});

	it('list does not read data', async () => {
		const data = new MemoryKeyValueStore<Record<string, unknown>>();
		const r = new SavegameRepository(new MemoryKeyValueStore<SavegameListItem>(), data, new MemoryKeyValueStore<Blob>(), true);
		await r.save(summary('a', 1), undefined);
		const get = vi.spyOn(data, 'get');
		const getAll = vi.spyOn(data, 'getAll');
		await r.list();
		expect(get).not.toHaveBeenCalled();
		expect(getAll).not.toHaveBeenCalled();
	});

	it('get joins summary and data', async () => {
		const r = repo();
		await r.save(summary('a', 1), undefined);
		expect((await r.get('a'))?.data).toEqual({ a: 1 });
	});

	it('get returns empty data when the data record is missing', async () => {
		const summaries = new MemoryKeyValueStore<SavegameListItem>();
		const r = new SavegameRepository(summaries, new MemoryKeyValueStore<Record<string, unknown>>(), new MemoryKeyValueStore<Blob>(), true);
		const item = SavegameRepository.moveSummaryData({ ...summary('b', 1), fileKept: false }).summary;
		await summaries.put('b', item);
		expect((await r.get('b'))?.data).toEqual({});
		expect(await r.get('missing')).toBeUndefined();
	});

	it('remove deletes summary, data and file', async () => {
		const data = new MemoryKeyValueStore<Record<string, unknown>>();
		const files = new MemoryKeyValueStore<Blob>();
		const summaries = new MemoryKeyValueStore<SavegameListItem>();
		const r = new SavegameRepository(summaries, data, files, true);
		await r.save(summary('a', 1), new Blob(['abc']));
		await r.remove('a');
		expect(await summaries.get('a')).toBeUndefined();
		expect(await data.get('a')).toBeUndefined();
		expect(await files.get('a')).toBeUndefined();
	});

	it('upgrades version 1 records and keeps them', () => {
		const { summary: moved, data } = SavegameRepository.moveSummaryData({ ...summary('a', 1), fileKept: true });
		expect(data).toEqual({ a: 1 });
		expect('data' in moved).toBe(false);
		expect(moved.id).toBe('a');
		expect(moved.fileKept).toBe(true);
		expect(SavegameRepository.moveSummaryData({ ...summary('b', 1), fileKept: false, data: undefined as never }).data).toEqual({});
	});

	it('keeps the previous data when re-saving fails', async () => {
		const data = new MemoryKeyValueStore<Record<string, unknown>>();
		const saves = new MemoryKeyValueStore<SavegameListItem>();
		const r = new SavegameRepository(saves, data, new MemoryKeyValueStore<Blob>(), true);
		await r.save(summary('a', 1), undefined);
		saves.put = () => Promise.reject(new Error('boom'));
		await expect(r.save({ ...summary('a', 2), data: { b: 2 } }, undefined)).rejects.toThrow('boom');
		expect((await r.get('a'))?.data).toEqual({ a: 1 });
	});

	it('keeps the previous file when re-saving fails', async () => {
		const saves = new MemoryKeyValueStore<SavegameListItem>();
		const r = new SavegameRepository(saves, new MemoryKeyValueStore<Record<string, unknown>>(), new MemoryKeyValueStore<Blob>(), true);
		await r.save(summary('a', 1), new Blob(['old']));
		saves.put = () => Promise.reject(new Error('boom'));
		await expect(r.save(summary('a', 2), new Blob(['new']))).rejects.toThrow('boom');
		expect(await (await r.getFile('a'))?.text()).toBe('old');
	});
});
