import { Component, ElementRef, computed, effect, inject, input, linkedSignal, output, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { StationModule } from '../../../shared/services/model/model';
import { WareGroupModel } from '../station-calculator.model';

let nextId = 0;

/**
 * Module picker: a search box filtering the modules grouped by ware group.
 * Arrow keys move through the options, Enter or Tab picks the highlighted one and Escape closes the list.
 */
@Component({
	selector: 'app-autocomplete',
	imports: [FormField],
	templateUrl: './autocomplete.component.html',
})
export class AutocompleteComponent {
	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

	/** selected module id */
	readonly id = input<string | null>(null);
	readonly groups = input<WareGroupModel[]>([]);
	readonly selectModule = output<string>();

	protected readonly listId = `autocomplete-${nextId++}`;

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

	/** the filtered modules in display order, for keyboard navigation */
	private readonly options = computed(() => this.filteredGroups().flatMap((group) => group.modules));

	/** highlighted option, back to none whenever the filter changes */
	readonly activeIndex = linkedSignal<StationModule[], number>({ source: this.options, computation: () => -1 });
	readonly activeId = computed(() => this.options()[this.activeIndex()]?.id ?? null);

	private timeout?: ReturnType<typeof setTimeout>;

	constructor() {
		// keep the highlighted option in view
		effect(() => {
			const id = this.activeId();
			if (id) {
				this.host.nativeElement.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest' });
			}
		});
	}

	optionId(module: StationModule) {
		return `${this.listId}-${module.id}`;
	}

	onFocus() {
		clearTimeout(this.timeout);
		this.visible.set(true);
	}

	onBlur() {
		this.timeout = setTimeout(() => {
			// accept a fully typed module name
			const match = this.exactMatch();
			if (match && match.id !== this.id()) {
				this.onClick(match);
				return;
			}
			this.query.set(this.selectedName());
			this.visible.set(false);
		}, 100);
	}

	onKeydown(event: KeyboardEvent) {
		const options = this.options();
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp': {
				event.preventDefault();
				this.visible.set(true);
				if (options.length > 0) {
					const step = event.key === 'ArrowDown' ? 1 : -1;
					this.activeIndex.update((index) =>
						index < 0 && step < 0 ? options.length - 1 : (index + step + options.length) % options.length
					);
				}
				break;
			}
			case 'Enter': {
				const module = options[this.activeIndex()] ?? this.exactMatch() ?? (options.length === 1 ? options[0] : undefined);
				if (this.visible() && module) {
					event.preventDefault();
					this.onClick(module);
				}
				break;
			}
			case 'Tab': {
				const module = options[this.activeIndex()];
				if (this.visible() && module) {
					this.onClick(module);
				}
				break;
			}
			case 'Escape':
				if (this.visible()) {
					event.preventDefault();
					this.query.set(this.selectedName());
					this.visible.set(false);
				}
				break;
		}
	}

	onClick(module: StationModule) {
		this.query.set(module.name);
		this.selectModule.emit(module.id);
		this.visible.set(false);
	}

	private exactMatch() {
		const name = this.query().trim().toLowerCase();
		return name ? this.options().find((m) => m.name.trim().toLowerCase() === name) : undefined;
	}
}
