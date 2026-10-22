import { Component, computed, model, output } from '@angular/core';
import { AlertComponent } from '../../shared/components/alert.component';
import { ImportResult } from '../services/construction-plans';

@Component({
	selector: 'app-import-result',
	imports: [AlertComponent],
	templateUrl: './import-plan-result.component.html',
})
export class ImportPlanResultComponent {
	readonly result = model<ImportResult | null>(null);
	readonly selectPlan = output<string>();

	protected readonly status = computed(() => {
		const result = this.result();
		const hasLayouts = !!result?.layouts?.length;
		if (result?.error && !hasLayouts) {
			return { type: 'danger', message: $localize`Failed to import plans.` };
		}
		if (result?.error) {
			return { type: 'warning', message: $localize`Imported plans, but errors occurred trying to import some of them.` };
		}
		return { type: 'success', message: $localize`Successfully imported plans` };
	});
}
