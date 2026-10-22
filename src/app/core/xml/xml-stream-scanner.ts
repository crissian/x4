export type XmlAttributes = Record<string, string>;

export interface XmlScanHandler {
	/** path = names of the open elements including this one; live array, copy to keep. attrs parses on demand. */
	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void;
	close?(name: string, path: readonly string[]): void;
}

export type XmlScanErrorCode = 'invalid-xml' | 'truncated';

export class XmlScanError extends Error {
	constructor(
		readonly code: XmlScanErrorCode,
		message: string,
	) {
		super(message);
		this.name = 'XmlScanError';
	}
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const ENTITY_PATTERN = /&(#x[0-9a-fA-F]+|#[0-9]+|[a-z]+);/g;
const ATTRIBUTE_PATTERN = /([^\s=/]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
const TAG_END_PATTERN = /[>"']/g;

export function decodeXmlEntities(value: string): string {
	if (!value.includes('&')) {
		return value;
	}
	return value.replace(ENTITY_PATTERN, (match, body: string) => {
		if (body.charCodeAt(0) !== 35) {
			return Object.hasOwn(ENTITIES, body) ? ENTITIES[body] : match;
		}
		const code = body.charCodeAt(1) === 120 ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
		return code <= 0x10ffff ? String.fromCodePoint(code) : match;
	});
}

function parseAttributes(tag: string): XmlAttributes {
	const attrs: XmlAttributes = {};
	const pattern = new RegExp(ATTRIBUTE_PATTERN);
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(tag))) {
		attrs[match[1]] = decodeXmlEntities(match[2] ?? match[3]);
	}
	return attrs;
}

/** Index of the `>` ending the tag that starts at `from`, skipping quoted values; -1 when incomplete. */
function findTagEnd(buffer: string, from: number): number {
	const pattern = TAG_END_PATTERN;
	pattern.lastIndex = from;
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(buffer))) {
		if (match[0] === '>') {
			return match.index;
		}
		const quoteEnd = buffer.indexOf(match[0], match.index + 1);
		if (quoteEnd < 0) {
			return -1;
		}
		pattern.lastIndex = quoteEnd + 1;
	}
	return -1;
}

function nameEnd(tag: string, from: number): number {
	let i = from;
	for (; i < tag.length; i++) {
		const c = tag.charCodeAt(i);
		if (c === 32 || c === 47 || (c >= 9 && c <= 13)) {
			break;
		}
	}
	return i;
}

/**
 * Forward-only XML scanner: reports element open/close events with the element path and skips
 * text, comments, declarations and doctypes. Chunks may split the input anywhere.
 */
export class XmlStreamScanner {
	private buffer = '';
	private readonly path: string[] = [];
	private rootSeen = false;

	constructor(private readonly handler: XmlScanHandler) {}

	get depth(): number {
		return this.path.length;
	}

	write(chunk: string): void {
		const buffer = this.buffer ? this.buffer + chunk : chunk;
		let pos = 0;
		for (;;) {
			const lt = buffer.indexOf('<', pos);
			if (lt < 0) {
				pos = buffer.length;
				break;
			}
			const next = buffer.charCodeAt(lt + 1);
			let end: number;
			if (next !== next) {
				pos = lt;
				break;
			} else if (next === 63) {
				end = buffer.indexOf('?>', lt + 2);
				end = end < 0 ? -1 : end + 2;
			} else if (next === 33) {
				const comment = buffer.startsWith('<!--', lt);
				end = comment ? buffer.indexOf('-->', lt + 4) : findTagEnd(buffer, lt + 2);
				end = end < 0 ? -1 : end + (comment ? 3 : 1);
			} else {
				const gt = findTagEnd(buffer, lt + 1);
				if (gt >= 0) {
					this.tag(buffer.slice(lt + 1, gt));
				}
				end = gt < 0 ? -1 : gt + 1;
			}
			if (end < 0) {
				pos = lt;
				break;
			}
			pos = end;
		}
		this.buffer = pos < buffer.length ? buffer.slice(pos) : '';
	}

	end(): void {
		if (this.buffer.length > 0 || this.path.length > 0 || !this.rootSeen) {
			throw new XmlScanError('truncated', 'The XML ended before the root element was closed.');
		}
	}

	private tag(tag: string): void {
		const path = this.path;
		if (tag.charCodeAt(0) === 47) {
			const name = tag.slice(1, nameEnd(tag, 1));
			if (path.length === 0 || path[path.length - 1] !== name) {
				throw new XmlScanError('invalid-xml', `Unexpected closing tag </${name}>.`);
			}
			this.handler.close?.(name, path);
			path.pop();
			return;
		}
		if (path.length === 0 && this.rootSeen) {
			throw new XmlScanError('invalid-xml', 'More than one root element.');
		}
		this.rootSeen = true;
		const name = tag.slice(0, nameEnd(tag, 0));
		path.push(name);
		let cache: XmlAttributes | undefined;
		this.handler.open(name, path, () => (cache ??= parseAttributes(tag)));
		if (tag.charCodeAt(tag.length - 1) === 47) {
			this.handler.close?.(name, path);
			path.pop();
		}
	}
}
