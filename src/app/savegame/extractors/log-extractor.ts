import { MacroId } from '../../core/macro-id';
import { XmlExtractor } from '../../core/xml/xml-extractor';
import { XmlAttributes } from '../../core/xml/xml-stream-scanner';
import { LogFactionRefs } from '../log/log-faction-refs';
import { LogText } from '../log/log-text';
import { LossText } from '../log/loss-text';
import type { SaveLog, SaveLogEntry, SaveLoss } from '../log/save-log-model';

/**
 * Reads the player's logbook from savegame/log/entry, and the player-owned objects it reports destroyed. Entries
 * point at objects by component id; the sector components seen in the universe before the log turn those into
 * sector ids. Only the newest `MAX_ENTRIES` entries are kept; the losses are all kept.
 */
export class LogExtractor implements XmlExtractor<SaveLog> {
	/** The key of the extracted data in the save's data. */
	static readonly KEY = 'log';
	/** How many entries are kept, the newest ones. */
	static readonly MAX_ENTRIES = 5000;
	readonly key = LogExtractor.KEY;

	/** sector id by component id */
	private readonly sectors = new Map<string, string>();
	private readonly entries: (SaveLogEntry & { component?: string })[] = [];
	private readonly losses: (SaveLoss & { component?: string })[] = [];
	private finished = false;

	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		if (name === 'component') {
			const a = attrs();
			if (a['class'] === 'sector' && a['id'] && a['macro']) {
				this.sectors.set(a['id'], MacroId.of(a['macro']));
			}
			return;
		}
		if (name !== 'entry' || path.length !== 3 || path[1] !== 'log') {
			return;
		}
		const a = attrs();
		const time = Number(a['time']);
		const entry: SaveLogEntry & { component?: string } = {
			time: Number.isFinite(time) ? time : 0,
			title: LogText.clean(a['title'] ?? ''),
			...LogFactionRefs.resolve(a['faction']),
		};
		if (a['category']) {
			entry.category = a['category'];
		}
		const text = a['text'] ? LogText.short(a['text']) : '';
		if (text) {
			entry.text = text;
		}
		if (a['component']) {
			entry.component = a['component'];
		}
		this.entries.push(entry);
		if (a['category'] === 'upkeep' && a['interact'] === 'showlocationonmap') {
			this.addLoss(entry, a['text']);
		}
	}

	close(name: string, path: readonly string[]): void {
		if (name === 'log' && path.length === 2) {
			this.finished = true;
		}
	}

	done(): boolean {
		return this.finished;
	}

	result(): SaveLog {
		const newestFirst = <T extends { time: number }>(rows: T[]) =>
			rows.map((row, i) => ({ row, i })).sort((a, b) => b.row.time - a.row.time || b.i - a.i);
		return {
			total: this.entries.length,
			entries: newestFirst(this.entries)
				.slice(0, LogExtractor.MAX_ENTRIES)
				.map(({ row }) => this.withSector(row)),
			losses: newestFirst(this.losses).map(({ row }) => this.withSector(row)),
		};
	}

	private addLoss(entry: SaveLogEntry & { component?: string }, rawText: string | undefined) {
		const parts = LossText.parse(entry.title, rawText ? LogText.clean(rawText) : undefined);
		if (!parts) {
			return;
		}
		this.losses.push({ time: entry.time, ...parts, component: entry.component });
	}

	/** Swaps the component id for the sector id it names; drops the location text a known sector makes redundant. */
	private withSector<T extends { component?: string; sector?: string; location?: string }>(row: T): T {
		const { component, ...rest } = row;
		const sector = component ? this.sectors.get(component) : undefined;
		if (!sector) {
			return rest as T;
		}
		const result = { ...rest, sector } as T;
		delete result.location;
		return result;
	}
}
