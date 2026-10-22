import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, TemplateRef, inject, signal, viewChild } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { LucideSave } from '@lucide/angular';
import { ConfirmComponent, ConfirmData } from '../../shared/components/confirm.component';
import { AppDialog } from '../../shared/components/modal/dialog';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { LayoutService } from '../services/layout-service';

@Component({
	imports: [ModalComponent, FormField, LucideSave],
	templateUrl: './save-layout.component.html',
})
export class SaveLayoutComponent {
	protected readonly dialogRef = inject<DialogRef<string>>(DialogRef);
	private readonly dialog = inject(Dialog);
	private readonly layoutService = inject(LayoutService);
	private readonly existsMessage = viewChild.required<TemplateRef<{ $implicit: string }>>('existsMessage');

	readonly model = signal({ name: '' });
	readonly saveForm = form(this.model, (layout) => {
		required(layout.name);
	});

	saveLayout() {
		if (this.saveForm().invalid()) {
			return;
		}

		const name = this.model().name.trim();
		if (this.layoutService.getLayout(name)) {
			AppDialog.open<boolean, ConfirmData<{ $implicit: string }>>(this.dialog, ConfirmComponent, {
				data: { title: $localize`Confirm Save`, message: this.existsMessage(), context: { $implicit: name } },
			}).closed.subscribe((res) => {
				if (res) {
					this.dialogRef.close(name);
				}
			});
		} else {
			this.dialogRef.close(name);
		}
	}
}
