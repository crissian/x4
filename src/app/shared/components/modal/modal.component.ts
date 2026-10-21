import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, input } from '@angular/core';
import { LucideX } from '@lucide/angular';

/**
 * Frame for dialog content opened through {@link openDialog}: header with title and close button,
 * projected body and an optional `[footer]` slot.
 */
@Component({
	selector: 'app-modal',
	imports: [LucideX],
	host: { class: 'block' },
	templateUrl: './modal.component.html',
})
export class ModalComponent {
	readonly title = input.required<string>();
	protected readonly dialogRef = inject(DialogRef);
}
