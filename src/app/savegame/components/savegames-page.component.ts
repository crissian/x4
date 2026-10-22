import { DecimalPipe } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { Component, TemplateRef, computed, inject, signal, viewChild } from '@angular/core';
import { LucideX } from '@lucide/angular';
import { AlertComponent } from '../../shared/components/alert.component';
import { ConfirmComponent, ConfirmData } from '../../shared/components/confirm.component';
import { FileDropComponent } from '../../shared/components/file-drop.component';
import { AppDialog } from '../../shared/components/modal/dialog';
import { ProgressBarComponent } from '../../shared/components/progress-bar.component';
import { SavegameErrorCode, SavegameListItem } from '../savegame-model';
import { SavegameStore } from '../savegame-store';
import { SavegameCardComponent } from './savegame-card.component';

interface Notice {
	type: 'warning' | 'danger';
	text: string;
}

@Component({
	imports: [DecimalPipe, FileDropComponent, ProgressBarComponent, AlertComponent, SavegameCardComponent, LucideX],
	templateUrl: './savegames-page.component.html',
})
export default class SavegamesPageComponent {
	protected readonly store = inject(SavegameStore);
	private readonly dialog = inject(Dialog);

	private readonly deleteMessage = viewChild.required<TemplateRef<{ $implicit: SavegameListItem }>>('deleteMessage');

	protected readonly notice = signal<Notice | null>(null);
	protected readonly percent = computed(() => {
		const loading = this.store.loading();
		return loading && loading.total > 0 ? Math.round((loading.read / loading.total) * 100) : 0;
	});

	constructor() {
		this.store.open();
	}

	protected async load(files: File[]) {
		this.notice.set(null);
		const outcome = await this.store.load(files[0]);
		switch (outcome.status) {
			case 'added':
				this.store.select(outcome.id);
				break;
			case 'older':
				this.notice.set({
					type: 'warning',
					text: $localize`A newer save of this game is already stored, so this one was skipped.`,
				});
				break;
			case 'busy':
				this.notice.set({ type: 'warning', text: $localize`Another save is still loading.` });
				break;
			case 'error':
				this.notice.set({ type: 'danger', text: SavegamesPageComponent.errorText(outcome.code) });
				break;
		}
	}

	protected remove(item: SavegameListItem) {
		AppDialog.open<boolean, ConfirmData<{ $implicit: SavegameListItem }>>(this.dialog, ConfirmComponent, {
			data: { title: $localize`Confirm Delete`, message: this.deleteMessage(), context: { $implicit: item } },
		}).closed.subscribe((confirmed) => {
			if (confirmed) {
				this.store
					.remove(item.id)
					.catch(() =>
						this.notice.set({
							type: 'danger',
							text: $localize`The save could not be deleted from this browser.`,
						})
					);
			}
		});
	}

	private static errorText(code: SavegameErrorCode): string {
		switch (code) {
			case 'not-a-savegame':
				return $localize`This file is not an X4 savegame.`;
			case 'invalid-xml':
				return $localize`The savegame is damaged and could not be read.`;
			case 'truncated':
				return $localize`The file is incomplete, it may have been cut off while copying or downloading.`;
			case 'store-failed':
				return $localize`The save was read but could not be stored in this browser.`;
			default:
				return $localize`The file could not be read.`;
		}
	}
}
