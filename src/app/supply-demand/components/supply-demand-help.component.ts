import { Component } from '@angular/core';
import { LucideChevronDown, LucideChevronRight } from '@lucide/angular';
import { LocalStorage } from '../../core/services/local-storage';
import { SupplyDemandDiagnosis } from '../supply-demand-diagnosis';

/** A collapsible note on how to read the table; whether it is closed is remembered. */
@Component({
	selector: 'app-supply-demand-help',
	imports: [LucideChevronDown, LucideChevronRight],
	templateUrl: './supply-demand-help.component.html',
})
export class SupplyDemandHelpComponent {
	protected readonly kinds = SupplyDemandDiagnosis.KINDS;
	protected readonly open = LocalStorage.persistedSignal('supply-demand-help-open', true, {
		parse: (x) => (typeof x === 'boolean' ? x : undefined),
	});
}
