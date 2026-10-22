import { openTextStream } from '../core/streams/open-text-stream';
import { runExtractors, XmlExtractor } from '../core/xml/xml-extractor';
import { XmlScanError } from '../core/xml/xml-stream-scanner';
import { createInfoExtractor } from './extractors/info-extractor';
import { SavegameError, SavegameInfo } from './savegame-model';

export interface ReadSavegameOptions {
	size: number;
	onProgress?(read: number, total: number): void;
	onInfo?(info: SavegameInfo): void;
}

export interface ReadSavegameResult {
	info: SavegameInfo;
	data: Record<string, unknown>;
	gzipCopy?: Blob;
}

function toSavegameError(error: unknown): SavegameError {
	if (error instanceof SavegameError) {
		return error;
	}
	if (error instanceof XmlScanError) {
		return new SavegameError(error.code, error.message);
	}
	const message = error instanceof Error ? error.message : String(error);
	// a cut-off gzip stream makes DecompressionStream fail with a TypeError
	return new SavegameError(error instanceof TypeError ? 'truncated' : 'read-failed', message);
}

/** Reads the whole file; info is extracted first, `data` holds the results of the other extractors. */
export async function readSavegame(
	bytes: ReadableStream<Uint8Array>,
	options: ReadSavegameOptions,
): Promise<ReadSavegameResult> {
	let rootChecked = false;
	const guard: XmlExtractor<null> = {
		key: '',
		open(name, path) {
			if (!rootChecked && path.length === 1) {
				rootChecked = true;
				if (name !== 'savegame') {
					throw new SavegameError('not-a-savegame', 'The file is not an X4 savegame.');
				}
			}
		},
		done: () => rootChecked,
		result: () => null,
	};
	const extractors: XmlExtractor[] = [guard, createInfoExtractor()];
	try {
		const opened = await openTextStream(bytes, { size: options.size, onProgress: options.onProgress, keepGzip: true });
		const results = await runExtractors(opened.text, extractors, (key, result) => {
			if (key === 'info' && result) {
				options.onInfo?.(result as SavegameInfo);
			}
		});
		const { info, ...data } = results;
		delete data[''];
		if (!info) {
			throw new SavegameError('not-a-savegame', 'The file has no savegame header.');
		}
		if (!(info as SavegameInfo).guid) {
			throw new SavegameError('not-a-savegame', 'The savegame header has no guid.');
		}
		return { info: info as SavegameInfo, data, gzipCopy: opened.gzipCopy ? await opened.gzipCopy : undefined };
	} catch (error) {
		const failure = toSavegameError(error);
		// no root element at all (empty file, plain text, packed non-XML): not a cut-off save
		if (!rootChecked && (failure.code === 'truncated' || failure.code === 'invalid-xml')) {
			throw new SavegameError('not-a-savegame', failure.message);
		}
		throw failure;
	}
}
