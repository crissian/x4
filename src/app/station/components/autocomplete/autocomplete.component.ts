import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { StationModule } from '../../../shared/services/model/model';
import { WareGroupModel } from '../station-calculator.model';

/**
 * Module picker: a search box filtering the modules grouped by ware group.
 */
@Component({
	selector: 'app-autocomplete',
	imports: [FormField],
	templateUrl: './autocomplete.component.html',
})
export class AutocompleteComponent {
	/** selected module id */
	readonly id = input<string>(null);
	readonly groups = input<WareGroupModel[]>([]);
	readonly selectModule = output<string>();

	private readonly selectedName = computed(() => {
		const id = this.id();
		for (const group of this.groups()) {
			const module = group.modules.find((m) => m.id === id);
			if (module) {
				return module.name;
			}
		}
		return '';
	});

	/** search text, reset to the selected module name when the selection changes */
	readonly query = linkedSignal(() => this.selectedName());
	readonly queryField = form(this.query);

	readonly visible = signal(false);

	readonly filteredGroups = computed(() => {
		const filter = this.query().trim().toLowerCase();
		return this.groups()
			.map((group) => ({
				...group,
				modules: filter
					? group.modules.filter((m) => m.name.trim().toLowerCase().includes(filter))
					: group.modules,
			}))
			.filter((group) => group.modules.length > 0);
	});

	private timeout: ReturnType<typeof setTimeout>;

	onFocus() {
		clearTimeout(this.timeout);
		this.visible.set(true);
	}

	onBlur() {
		this.timeout = setTimeout(() => {
			this.query.set(this.selectedName());
			this.visible.set(false);
		}, 100);
	}

	onClick(module: StationModule) {
		this.query.set(module.name);
		this.selectModule.emit(module.id);
		this.visible.set(false);
	}
}
