import { describe, expect, it, vi } from 'vitest';
import { gunzipBlob, gzipBytes, streamOf } from '../core/streams/test-streams';
import { readSavegame } from './read-savegame';
import { SavegameError } from './savegame-model';
import { INFO_9_00 } from './testdata/info-9.00';

const encoder = new TextEncoder();

async function rejection(promise: Promise<unknown>): Promise<unknown> {
	try {
		await promise;
	} catch (error) {
		return error;
	}
	throw new Error('expected a rejection');
}

function bigSave(): string {
	let seed = 1;
	const items: string[] = [];
	for (let i = 0; i < 5000; i++) {
		seed = (seed * 1103515245 + 12345) % 2147483648;
		items.push(`<c id="${seed.toString(36)}${i}"/>`);
	}
	return INFO_9_00.replace('<universe></universe>', `<universe>${items.join('')}</universe>`);
}

function plain(text: string): { bytes: ReadableStream<Uint8Array>; size: number } {
	const data = encoder.encode(text);
	return { bytes: streamOf([data.slice(0, 50), data.slice(50)]), size: data.length };
}

describe('readSavegame', () => {
	it('reads a gzipped save', async () => {
		const packed = await gzipBytes(encoder.encode(INFO_9_00));
		const onInfo = vi.fn();
		const result = await readSavegame(streamOf([packed]), { size: packed.length, onInfo });
		expect(result.info.guid).toBe('8A33B22E-2892-403F-B88C-DD0B320D825B');
		expect(result.info.playerName).toBe('Müller');
		expect(result.info.gameVersion).toBe(900);
		expect(result.gzipCopy).toBeUndefined();
		expect(onInfo).toHaveBeenCalledTimes(1);
	});

	it('returns a gzip copy for an unpacked save', async () => {
		const { bytes, size } = plain(INFO_9_00);
		const result = await readSavegame(bytes, { size });
		expect(await gunzipBlob(result.gzipCopy!)).toBe(INFO_9_00);
	});

	it('rejects a file without <savegame>', async () => {
		const { bytes, size } = plain('<foo/>');
		const error = await rejection(readSavegame(bytes, { size }));
		expect(error).toBeInstanceOf(SavegameError);
		expect((error as SavegameError).code).toBe('not-a-savegame');
	});

	it.each([
		['an empty file', ''],
		['plain text', 'just some text, no markup'],
	])('rejects %s as not a savegame', async (_label, text) => {
		const { bytes, size } = plain(text);
		const error = await rejection(readSavegame(bytes, { size }));
		expect((error as SavegameError).code).toBe('not-a-savegame');
	});

	it('rejects gzipped non-XML as not a savegame', async () => {
		const packed = await gzipBytes(encoder.encode('hello world, this is not xml'));
		const error = await rejection(readSavegame(streamOf([packed]), { size: packed.length }));
		expect((error as SavegameError).code).toBe('not-a-savegame');
	});

	it.each([
		['empty', INFO_9_00.replace(/guid="[^"]*"/, 'guid=""')],
		['missing', INFO_9_00.replace(/guid="[^"]*"/, '')],
	])('rejects a save with an %s guid', async (_label, text) => {
		const { bytes, size } = plain(text);
		const error = await rejection(readSavegame(bytes, { size }));
		expect((error as SavegameError).code).toBe('not-a-savegame');
	});

	it('reports a truncated gzip', async () => {
		const packed = await gzipBytes(encoder.encode(bigSave()));
		const cut = packed.slice(0, packed.length - 100);
		const error = await rejection(readSavegame(streamOf([cut]), { size: cut.length }));
		expect((error as SavegameError).code).toBe('truncated');
	});

	it('reports a save cut off inside the XML', async () => {
		const { bytes, size } = plain(INFO_9_00.replace('</savegame>', ''));
		const error = await rejection(readSavegame(bytes, { size }));
		expect((error as SavegameError).code).toBe('truncated');
	});

	it('rejects promptly on broken xml in a large plain save', async () => {
		const data = encoder.encode('<savegame><a></b>' + 'x'.repeat(2_000_000));
		const chunks: Uint8Array[] = [];
		for (let i = 0; i < data.length; i += 65536) {
			chunks.push(data.slice(i, i + 65536));
		}
		const error = await rejection(readSavegame(streamOf(chunks), { size: data.length }));
		expect((error as SavegameError).code).toBe('invalid-xml');
	});

	it('reports broken xml', async () => {
		const { bytes, size } = plain('<savegame><a></b>');
		const error = await rejection(readSavegame(bytes, { size }));
		expect((error as SavegameError).code).toBe('invalid-xml');
	});
});
