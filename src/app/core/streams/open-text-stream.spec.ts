import { describe, expect, it } from 'vitest';
import { TextStream } from './open-text-stream';
import { TestStreams } from './test-streams';

const encoder = new TextEncoder();

describe('TextStream', () => {
	it('reads plain text and reports progress up to the size', async () => {
		const bytes = encoder.encode('<a>hello</a>');
		const calls: [number, number][] = [];
		const opened = await TextStream.open(TestStreams.streamOf([bytes.slice(0, 5), bytes.slice(5)]), {
			size: bytes.length,
			onProgress: (read, total) => calls.push([read, total]),
		});
		expect(opened.gzipped).toBe(false);
		expect(await TestStreams.collectText(opened.text)).toBe('<a>hello</a>');
		expect(calls[calls.length - 1]).toEqual([bytes.length, bytes.length]);
	});

	it('gunzips gzip input', async () => {
		const packed = await TestStreams.gzipBytes(encoder.encode('<a>zip</a>'));
		const opened = await TextStream.open(TestStreams.streamOf([packed.slice(0, 7), packed.slice(7)]), { size: packed.length });
		expect(opened.gzipped).toBe(true);
		expect(opened.gzipCopy).toBeUndefined();
		expect(await TestStreams.collectText(opened.text)).toBe('<a>zip</a>');
	});

	it('returns a gzip copy of plain input when asked', async () => {
		const bytes = encoder.encode('<a>copy me</a>');
		const opened = await TextStream.open(TestStreams.streamOf([bytes]), { size: bytes.length, keepGzip: true });
		expect(await TestStreams.collectText(opened.text)).toBe('<a>copy me</a>');
		expect(await TestStreams.gunzipBlob(await opened.gzipCopy!)).toBe('<a>copy me</a>');
	});

	it('decodes multi-byte characters split across chunks', async () => {
		const bytes = encoder.encode('<p n="Müller"/>');
		const split = bytes.indexOf(0xc3) + 1;
		const opened = await TextStream.open(TestStreams.streamOf([bytes.slice(0, split), bytes.slice(split)]), { size: bytes.length });
		expect(await TestStreams.collectText(opened.text)).toBe('<p n="Müller"/>');
	});

	it('settles the gzip copy when the text stream is cancelled', async () => {
		const bytes = encoder.encode('<a>'.repeat(1000));
		const opened = await TextStream.open(TestStreams.streamOf([bytes.slice(0, 100), bytes.slice(100)]), {
			size: bytes.length,
			keepGzip: true,
		});
		const reader = opened.text.getReader();
		await reader.read();
		await reader.cancel('stop');
		const outcome = await Promise.race([
			opened.gzipCopy!.then(
				() => 'settled',
				() => 'settled',
			),
			new Promise((resolve) => setTimeout(() => resolve('hung'), 2000)),
		]);
		expect(outcome).toBe('settled');
	});
});
