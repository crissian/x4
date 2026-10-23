import { Component, computed, inject, input, model } from '@angular/core';
import { FormField, form, type FormValueControl } from '@angular/forms/signals';
import { FactionService } from '../services/faction.service';
import { SearchableSelectComponent } from './searchable-select/searchable-select.component';

/**
 * A searchable sector picker whose value is the sector name, bound with [formField]; emptying it clears the value.
 * Sectors show their owner faction (at game start) as the detail, so typing a faction finds its sectors.
 */
@Component({
	selector: 'app-sector-input',
	imports: [FormField, SearchableSelectComponent],
	templateUrl: './sector-input.component.html',
	host: { class: 'block' },
})
export class SectorInputComponent implements FormValueControl<string> {
	private readonly factions = inject(FactionService);

	readonly value = model('');
	readonly sectors = input.required<readonly { id: string; name: string; owner?: string }[]>();
	readonly label = input.required<string>();
	/** Keeps the label for screen readers only. */
	readonly hideLabel = input(false);
	readonly placeholder = input<string>();
	readonly inputId = input<string>();
	/** Storage key of the recently picked sectors, listed first; none without it. */
	readonly recentKey = input<string>();

	protected readonly field = form(this.value);
	protected readonly options = computed(() =>
		this.sectors().map(({ name, owner }) => ({
			id: name,
			name,
			detail: owner ? this.factions.getEntity(owner)?.name : undefined,
		}))
	);
}
