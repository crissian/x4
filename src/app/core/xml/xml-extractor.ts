import { XmlScanHandler, XmlStreamScanner } from './xml-stream-scanner';

export interface XmlExtractor<T = unknown> extends XmlScanHandler {
	readonly key: string;
	done(): boolean;
	result(): T;
}

/** Feeds every chunk to one scanner whose events go to all extractors not yet done; calls end(). */
export async function runExtractors(
	text: ReadableStream<string>,
	extractors: XmlExtractor[],
	onDone?: (key: string, result: unknown) => void,
): Promise<Record<string, unknown>> {
	const active = [...extractors];
	const results: Record<string, unknown> = {};
	const finished = new Set<XmlExtractor>();
	const checkDone = (extractor: XmlExtractor): void => {
		if (!finished.has(extractor) && extractor.done()) {
			finished.add(extractor);
			results[extractor.key] = extractor.result();
			onDone?.(extractor.key, results[extractor.key]);
			active.splice(active.indexOf(extractor), 1);
		}
	};
	extractors.forEach(checkDone);
	const scanner = new XmlStreamScanner({
		open(name, path, attrs) {
			for (const extractor of active) {
				extractor.open(name, path, attrs);
			}
		},
		close(name, path) {
			for (let i = active.length - 1; i >= 0; i--) {
				active[i].close?.(name, path);
				checkDone(active[i]);
			}
		},
	});
	const reader = text.getReader();
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			scanner.write(value);
		}
		scanner.end();
	} catch (error) {
		reader.cancel(error).catch(() => undefined);
		throw error;
	}
	for (const extractor of extractors) {
		if (!finished.has(extractor)) {
			results[extractor.key] = extractor.result();
		}
	}
	return results;
}
