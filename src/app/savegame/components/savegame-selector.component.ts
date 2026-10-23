import { Component, effect, inject, linkedSignal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideFolderOpen, LucideSave } from '@lucide/angular';
import { SavegameListItem } from '../savegame-model';
import { SavegameStore } from '../savegame-store';
import { Duration } from '../../core/format/duration';

/** Header select to pick the active save, or a link to the saves page when there are none. */
@Component({
	selector: 'app-savegame-selector',
	imports: [FormField, RouterLink, RouterLinkActive, LucideFolderOpen, LucideSave],
	templateUrl: './savegame-selector.component.html',
})
export class SavegameSelectorComponent {
	private readonly store = inject(SavegameStore);

	protected readonly saves = this.store.saves;
	private readonly model = linkedSignal(() => ({ active: this.store.activeId() ?? '' }));
	protected readonly selectorForm = form(this.model);

	constructor() {
		effect(() => {
			const id = this.selectorForm.active().value();
			if (id !== (this.store.activeId() ?? '')) {
				this.store.select(id === '' ? null : id);
			}
		});
	}

	protected label(save: SavegameListItem): string {
		return `${save.info.playerName} · ${save.info.saveName} · ${Duration.hoursMinutes(save.info.gameTime)}`;
	}
}
