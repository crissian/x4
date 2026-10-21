import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ModalComponent } from './modal/modal.component';

export interface ConfirmData {
	title: string;
	/** HTML message */
	message: string;
}

@Component({
	imports: [ModalComponent],
	templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
	protected readonly dialogRef = inject<DialogRef<boolean>>(DialogRef);
	protected readonly data = inject<ConfirmData>(DIALOG_DATA);
}
