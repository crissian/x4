import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
	selector: 'app-share-layout',
	imports: [ModalComponent],
	templateUrl: './share-layout.component.html',
})
export class ShareLayoutComponent {
	protected readonly dialogRef = inject(DialogRef);
	protected readonly url = inject<string>(DIALOG_DATA);
	protected readonly copied = signal(false);

	async copy(input: HTMLInputElement) {
		input.select();
		await navigator.clipboard.writeText(this.url);
		this.copied.set(true);
	}
}
