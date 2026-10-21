import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { LucideImport } from '@lucide/angular';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ModuleService } from '../../shared/services/module.service';
import { ImportResult, importConstructionPlans } from '../services/construction-plans';
import { LayoutService } from '../services/layout-service';

export type { ImportResult } from '../services/construction-plans';

@Component({
	selector: 'app-import-plans',
	imports: [ModalComponent, FormField, LucideImport],
	templateUrl: './import-plans.component.html',
})
export class ImportPlansComponent {
	protected readonly dialogRef = inject<DialogRef<ImportResult>>(DialogRef);
	private readonly moduleService = inject(ModuleService);
	private readonly layoutService = inject(LayoutService);

	readonly model = signal({ xml: '' });
	readonly importForm = form(this.model, (plans) => {
		required(plans.xml);
	});

	importPlans() {
		const result = importConstructionPlans(this.model().xml, this.moduleService, (layout) =>
			this.layoutService.saveLayout(layout)
		);
		this.dialogRef.close(result);
	}
}
