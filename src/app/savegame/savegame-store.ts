import { Injectable, Signal, computed, effect, inject, signal } from '@angular/core';
import { LocalStorage } from '../core/services/local-storage';
import { WorkerCancelled, WorkerTask } from '../core/workers/worker-task';
import { SavegameParser } from './parse-savegame';
import { ReadSavegameResult } from './read-savegame';
import {
	SAVEGAME_SCHEMA_VERSION,
	SavegameError,
	SavegameErrorCode,
	SavegameListItem,
	SavegameSummary,
} from './savegame-model';
import { SAVEGAME_REPOSITORY, SavegameRepository } from './savegame-repository';

export interface SavegameLoadState {
	fileName: string;
	read: number;
	total: number;
}

export type SavegameLoadOutcome =
	| { status: 'added' | 'replaced'; id: string }
	/** a newer save of this playthrough is stored; nothing changed */
	| { status: 'older'; id: string }
	| { status: 'cancelled' }
	| { status: 'busy' }
	| { status: 'error'; code: SavegameErrorCode };

export type SavegameStatus = 'ok' | 'updating' | 'reload-needed';

@Injectable({ providedIn: 'root' })
export class SavegameStore {
	private readonly parser = inject(SavegameParser);
	private readonly openRepository = inject(SAVEGAME_REPOSITORY);
	/** undefined until open() is called */
	private repositoryReady: Promise<SavegameRepository> | undefined;
	private readonly list = signal<SavegameListItem[] | null>(null);
	private readonly storedActive = LocalStorage.persistedSignal<string | null>('activeSavegame', null, {
		parse: (value) => (typeof value === 'string' ? value : undefined),
	});
	private readonly failed = signal<ReadonlySet<string>>(new Set());
	private readonly revision = signal(0);
	private readonly activeSummary = signal<SavegameSummary | null>(null);
	private readonly loadingState = signal<SavegameLoadState | null>(null);
	/** null until the repository is open */
	private readonly persistentState = signal<boolean | null>(null);
	private readonly storageState = signal<{ usage: number; quota: number } | null>(null);
	private task: WorkerTask<ReadSavegameResult> | undefined;
	private cancelRequested = false;
	private persistRequested = false;

	readonly saves: Signal<SavegameListItem[]> = computed(() => this.list() ?? []);
	readonly activeId: Signal<string | null> = computed(() => {
		const id = this.storedActive();
		const list = this.list();
		return list && !list.some((item) => item.id === id) ? null : id;
	});
	readonly active: Signal<SavegameSummary | null> = computed(() => {
		const summary = this.activeSummary();
		return summary && summary.id === this.activeId() ? summary : null;
	});
	readonly loading: Signal<SavegameLoadState | null> = this.loadingState.asReadonly();
	readonly persistent: Signal<boolean | null> = this.persistentState.asReadonly();
	readonly storage: Signal<{ usage: number; quota: number } | null> = this.storageState.asReadonly();

	constructor() {
		effect((onCleanup) => {
			const id = this.activeId();
			this.revision();
			let stale = false;
			onCleanup(() => (stale = true));
			if (id === null) {
				this.activeSummary.set(null);
				return;
			}
			if (!this.repositoryReady) {
				this.activeSummary.set(null);
				return;
			}
			void this.repositoryReady.then((repository) => repository.get(id)).then(
				(summary) => !stale && this.activeSummary.set(summary ?? null),
				() => !stale && this.activeSummary.set(null),
			);
		});
		if (this.storedActive() !== null || LocalStorage.read<string>('savegames', '') === '1') {
			this.open();
		}
	}

	/** Opens the repository (idempotent); IndexedDB is not touched before this is called. */
	open(): void {
		this.ensureOpen();
	}

	status(id: string): SavegameStatus {
		const item = this.saves().find((s) => s.id === id);
		if (!item || item.schemaVersion >= SAVEGAME_SCHEMA_VERSION) {
			return 'ok';
		}
		return item.fileKept && !this.failed().has(id) ? 'updating' : 'reload-needed';
	}

	async load(file: File): Promise<SavegameLoadOutcome> {
		if (this.loadingState()) {
			return { status: 'busy' };
		}
		this.loadingState.set({ fileName: file.name, read: 0, total: file.size });
		this.cancelRequested = false;
		let older: string | undefined;
		try {
			const repository = await this.ensureOpen();
			if (this.cancelRequested) {
				return { status: 'cancelled' };
			}
			if (this.list() === null) {
				await this.refresh(repository);
			}
			const stop = () => this.task?.cancel();
			this.task = this.parser.parse(file, {
				onProgress: (read, total) => this.loadingState.update((s) => s && { ...s, read, total }),
				onInfo: (info) => {
					const existing = this.list()?.find((s) => s.id === info.guid);
					if (existing && info.savedAt < existing.info.savedAt) {
						older = existing.id;
						stop();
					}
				},
			});
			if (older !== undefined || this.cancelRequested) {
				this.task.cancel();
			}
			const parsed = await this.task.result;
			if (older !== undefined) {
				return { status: 'older', id: older };
			}
			// authoritative check right before saving: the early onInfo check is only an optimisation
			const existing = await repository.get(parsed.info.guid);
			if (existing && existing.info.savedAt > parsed.info.savedAt) {
				return { status: 'older', id: existing.id };
			}
			const replaced = !!existing;
			const stored = parsed.gzipCopy ?? file;
			await this.writeSave(
				repository,
				{
					id: parsed.info.guid,
					schemaVersion: SAVEGAME_SCHEMA_VERSION,
					addedAt: Date.now(),
					fileName: file.name,
					fileSize: stored.size,
					info: parsed.info,
					data: parsed.data,
				},
				stored,
			);
			await this.refresh(repository);
			this.requestPersistence();
			return { status: replaced ? 'replaced' : 'added', id: parsed.info.guid };
		} catch (error) {
			if (older !== undefined) {
				return { status: 'older', id: older };
			}
			if (error instanceof WorkerCancelled) {
				return { status: 'cancelled' };
			}
			return { status: 'error', code: error instanceof SavegameError ? error.code : 'read-failed' };
		} finally {
			this.task = undefined;
			this.loadingState.set(null);
		}
	}

	cancel() {
		this.cancelRequested = true;
		this.task?.cancel();
	}

	select(id: string | null) {
		this.storedActive.set(id);
	}

	/** Rejects when the save could not be deleted; the list is refreshed either way. */
	async remove(id: string): Promise<void> {
		const repository = await this.ensureOpen();
		try {
			await repository.remove(id);
			if (this.storedActive() === id) {
				this.storedActive.set(null);
			}
		} finally {
			// show what is actually stored, also after a partial failure
			await this.refresh(repository).catch(() => undefined);
		}
	}

	private ensureOpen(): Promise<SavegameRepository> {
		if (!this.repositoryReady) {
			this.repositoryReady = this.openRepository();
			void this.initialize(this.repositoryReady);
		}
		return this.repositoryReady;
	}

	private async initialize(ready: Promise<SavegameRepository>) {
		try {
			const repository = await ready;
			this.persistentState.set(repository.persistent);
			await this.refresh(repository);
			await this.reextract(repository);
		} catch {
			this.persistentState.update((persistent) => persistent ?? false);
			this.list.set([]);
		}
	}

	private async writeSave(repository: SavegameRepository, summary: Omit<SavegameSummary, 'fileKept'>, file: Blob) {
		try {
			await repository.save(summary, file);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			throw new SavegameError('store-failed', message);
		}
	}

	private async refresh(repository: SavegameRepository) {
		const items = await repository.list();
		this.list.set(items);
		LocalStorage.write('savegames', items.length > 0 ? '1' : undefined);
		this.revision.update((n) => n + 1);
		try {
			const estimate = await navigator.storage?.estimate?.();
			this.storageState.set(estimate ? { usage: estimate.usage ?? 0, quota: estimate.quota ?? 0 } : null);
		} catch {
			this.storageState.set(null);
		}
	}

	private requestPersistence() {
		if (this.persistRequested) {
			return;
		}
		this.persistRequested = true;
		try {
			void navigator.storage?.persist?.()?.catch(() => undefined);
		} catch {
			// best effort
		}
	}

	/** Re-parses outdated saves that kept their file, one at a time. */
	private async reextract(repository: SavegameRepository) {
		const outdated = (this.list() ?? []).filter((s) => s.schemaVersion < SAVEGAME_SCHEMA_VERSION && s.fileKept);
		for (const item of outdated) {
			try {
				const blob = await repository.getFile(item.id);
				const current = await repository.get(item.id);
				if (!blob || !current) {
					throw new Error('missing');
				}
				const parsed = await this.parser.parse(blob, {}).result;
				const latest = await repository.get(item.id);
				if (!latest || latest.info.savedAt !== current.info.savedAt) {
					continue; // replaced by a load in the meantime
				}
				await repository.save({ ...latest, schemaVersion: SAVEGAME_SCHEMA_VERSION, info: parsed.info, data: parsed.data }, blob);
			} catch {
				this.failed.update((set) => new Set(set).add(item.id));
			}
			await this.refresh(repository);
		}
	}
}
