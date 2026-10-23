import { Component, input, model } from '@angular/core';
import { FormField, form, type FormValueControl } from '@angular/forms/signals';

/** A labelled select of named options by id, bound with [formField]; with `allLabel`, an empty first option for "any". */
@Component({
	selector: 'app-option-select',
	imports: [FormField],
	templateUrl: './option-select.component.html',
	host: { class: 'block' },
})
export class OptionSelectComponent implements FormValueControl<string> {
	readonly value = model('');
	readonly options = input.required<readonly { id: string; name: string }[]>();
	readonly label = input.required<string>();
	/** Text of the empty first option, such as "All wares". */
	readonly allLabel = input<string>();
	readonly inputId = input<string>();

	protected readonly field = form(this.value);
}
