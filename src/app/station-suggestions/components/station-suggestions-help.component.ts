import { Component } from '@angular/core';
import { LucideChevronDown, LucideChevronRight } from '@lucide/angular';
import { LocalStorage } from '../../core/services/local-storage';

/** A collapsible note on how the suggestions are ranked; whether it is open is remembered. */
@Component({
	selector: 'app-station-suggestions-help',
	imports: [LucideChevronDown, LucideChevronRight],
	templateUrl: './station-suggestions-help.component.html',
})
export class StationSuggestionsHelpComponent {
	protected readonly open = LocalStorage.persistedSignal('station-suggestions-help-open', false, {
		parse: (x) => (typeof x === 'boolean' ? x : undefined),
	});
}
