import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, input } from '@angular/core';

/**
 * Frame for dialog content opened through {@link openDialog}: header with title and close button,
 * projected body and an optional `[footer]` slot.
 */
@Component({
	selector: 'app-modal',
	host: { class: 'block' },
	templateUrl: './modal.component.html',
})
export class ModalComponent {
	readonly title = input.required<string>();
	protected readonly dialogRef = inject(DialogRef);
}
