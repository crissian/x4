import { describe, expect, it } from 'vitest';
import { XmlScanError, XmlStreamScanner } from './xml-stream-scanner';

function scan(chunks: string[]): string[] {
	const events: string[] = [];
	const scanner = new XmlStreamScanner({
		open: (name, path, attrs) => events.push(`open ${name} [${path.join(',')}] ${JSON.stringify(attrs())}`),
		close: (name, path) => events.push(`close ${name} [${path.join(',')}]`),
	});
	for (const chunk of chunks) {
		scanner.write(chunk);
	}
	scanner.end();
	return events;
}

describe('XmlStreamScanner', () => {
	it('reports elements with their path and lazily parsed attributes', () => {
		expect(scan(['<a x="1"><b y="2"/></a>'])).toEqual([
			'open a [a] {"x":"1"}',
			'open b [a,b] {"y":"2"}',
			'close b [a,b]',
			'close a [a]',
		]);
	});

	it('gives the same events for every chunk split', () => {
		const sample =
			'<?xml version="1.0"?>\n<savegame>\n<info>\n<save name="#004" date="1"/>\n</info>\n<universe a="x &amp; y"></universe>\n</savegame>';
		const expected = scan([sample]);
		expect(expected.length).toBe(8);
		for (let i = 0; i <= sample.length; i++) {
			expect(scan([sample.slice(0, i), sample.slice(i)])).toEqual(expected);
		}
	});

	it('keeps > inside quoted attribute values', () => {
		expect(scan(['<a t="x > y / z"/>'])).toEqual(['open a [a] {"t":"x > y / z"}', 'close a [a]']);
	});

	it('decodes entities in attribute values', () => {
		const events = scan(['<a v="&amp; &lt; &gt; &quot; &apos; &#65; &#x42;"/>']);
		expect(events[0]).toBe('open a [a] {"v":"& < > \\" \' A B"}');
	});

	it('leaves unknown entities and prototype keys as they are', () => {
		const events = scan(['<a v="&constructor; &toString; &nbsp;"/>']);
		expect(events[0]).toBe('open a [a] {"v":"&constructor; &toString; &nbsp;"}');
	});

	it('skips the declaration, comments and text', () => {
		expect(scan(['<?xml version="1.0"?><!-- c --><a>text</a>'])).toEqual(['open a [a] {}', 'close a [a]']);
	});

	it('throws invalid-xml on a mismatched close tag', () => {
		expect(() => scan(['<a></b>'])).toThrow(XmlScanError);
		try {
			scan(['<a></b>']);
		} catch (e) {
			expect((e as XmlScanError).code).toBe('invalid-xml');
		}
	});

	it('throws truncated when input ends inside an element', () => {
		for (const input of ['<a><b/>', '']) {
			try {
				scan([input]);
				expect.unreachable();
			} catch (e) {
				expect(e).toBeInstanceOf(XmlScanError);
				expect((e as XmlScanError).code).toBe('truncated');
			}
		}
	});
});
