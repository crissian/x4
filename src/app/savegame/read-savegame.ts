import { TextStream } from '../core/streams/open-text-stream';
import { XmlExtractor, XmlExtractorRunner } from '../core/xml/xml-extractor';
import { XmlScanError } from '../core/xml/xml-stream-scanner';
import { BlueprintsExtractor } from './extractors/blueprints-extractor';
import { InfoExtractor } from './extractors/info-extractor';
import { MapExtractor } from './extractors/map-extractor';
import { LicencesExtractor } from './extractors/licences-extractor';
import { RelationsExtractor } from './extractors/relations-extractor';
import { ResearchExtractor } from './extractors/research-extractor';
import { RepresentativesExtractor } from './extractors/representatives-extractor';
import { ShipsExtractor } from './extractors/ships-extractor';
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

/** Checks that the root element is `savegame`; done as soon as the root was seen. */
class RootGuard implements XmlExtractor<null> {
	readonly key = '';
	checked = false;

	open(name: string, path: readonly string[]): void {
		if (!this.checked && path.length === 1) {
			this.checked = true;
			if (name !== 'savegame') {
				throw new SavegameError('not-a-savegame', 'The file is not an X4 savegame.');
			}
		}
	}

	done(): boolean {
		return this.checked;
	}

	result(): null {
		return null;
	}
}

export class SavegameReader {
	/** Reads the whole file; info is extracted first, `data` holds the results of the other extractors. */
	static async read(bytes: ReadableStream<Uint8Array>, options: ReadSavegameOptions): Promise<ReadSavegameResult> {
		const guard = new RootGuard();
		const extractors: XmlExtractor[] = [
			guard,
			new InfoExtractor(),
			new MapExtractor(),
			new RelationsExtractor(),
			new LicencesExtractor(),
			new BlueprintsExtractor(),
			new RepresentativesExtractor(),
			new ResearchExtractor(),
			new ShipsExtractor(),
		];
		try {
			const opened = await TextStream.open(bytes, { size: options.size, onProgress: options.onProgress, keepGzip: true });
			const results = await XmlExtractorRunner.run(opened.text, extractors, (key, result) => {
				if (key === InfoExtractor.KEY && result) {
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
			const failure = SavegameReader.toSavegameError(error);
			// no root element at all (empty file, plain text, packed non-XML): not a cut-off save
			if (!guard.checked && (failure.code === 'truncated' || failure.code === 'invalid-xml')) {
				throw new SavegameError('not-a-savegame', failure.message);
			}
			throw failure;
		}
	}

	private static toSavegameError(error: unknown): SavegameError {
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
}
