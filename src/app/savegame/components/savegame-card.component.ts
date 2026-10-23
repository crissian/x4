import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { LucideCheck, LucideTrash2 } from '@lucide/angular';
import { SavegameListItem } from '../savegame-model';
import { SavegameStatus } from '../savegame-store';
import { SavegameFormat } from '../savegame-format';
import { Duration } from '../../core/format/duration';

/** One stored save with its facts, a status badge and the make-active / delete actions. */
@Component({
	selector: 'app-savegame-card',
	imports: [DatePipe, DecimalPipe, LucideCheck, LucideTrash2],
	templateUrl: './savegame-card.component.html',
})
export class SavegameCardComponent {
	readonly save = input.required<SavegameListItem>();
	readonly active = input(false);
	readonly status = input<SavegameStatus>('ok');
	readonly activate = output();
	readonly remove = output();

	protected readonly gameTime = computed(() => Duration.hoursMinutes(this.save().info.gameTime));
	protected readonly version = computed(() => SavegameFormat.version(this.save().info.gameVersion));
	protected readonly extensions = computed(() => this.save().info.extensions.map((e) => SavegameFormat.extension(e.id)));
}
