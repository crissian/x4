import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, type TemplateRef } from '@angular/core';
import { LucideCheck, LucideX } from '@lucide/angular';
import { ModalComponent } from './modal/modal.component';
import { TemplateSlotDirective } from './template-slot.directive';

export interface ConfirmData<C = unknown> {
	title: string;
	/** plain text, or a template from the caller's .html rendered with `context` (for markup such as a bold name) */
	message: string | TemplateRef<C>;
	context?: C;
}

@Component({
	imports: [ModalComponent, TemplateSlotDirective, LucideCheck, LucideX],
	templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
	protected readonly dialogRef = inject<DialogRef<boolean>>(DialogRef);
	protected readonly data = inject<ConfirmData>(DIALOG_DATA);
	protected readonly template = typeof this.data.message === 'string' ? null : this.data.message;
	protected readonly text = typeof this.data.message === 'string' ? this.data.message : '';
}
