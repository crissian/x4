import { Component, input, model } from '@angular/core';
import { FormField, form, type FormValueControl } from '@angular/forms/signals';

/** A sector name box suggesting the sector names while typing, bound with [formField]. */
@Component({
	selector: 'app-sector-input',
	imports: [FormField],
	templateUrl: './sector-input.component.html',
	host: { class: 'block' },
})
export class SectorInputComponent implements FormValueControl<string> {
	private static nextId = 0;

	readonly value = model('');
	readonly sectors = input.required<readonly { id: string; name: string }[]>();
	readonly label = input.required<string>();
	/** Keeps the label for screen readers only. */
	readonly hideLabel = input(false);
	readonly placeholder = input<string>();
	readonly inputId = input<string>();

	protected readonly field = form(this.value);
	protected readonly listId = `app-sector-input-${SectorInputComponent.nextId++}`;
}
