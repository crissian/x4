import { Component, ElementRef, computed, effect, inject, input, linkedSignal, model, signal } from '@angular/core';
import { FormField, form, type FormValueControl } from '@angular/forms/signals';
import { RecentPicks } from './recent-picks';
import { SelectOption, SelectOptionFilter } from './select-option-filter';

/**
 * A select for long lists, bound with [formField]: the box shows the selected option's name, typing filters the
 * options by name and detail, and only the first matches are listed. Arrow keys move through the options, Enter or
 * Tab picks the highlighted one and Escape closes the list and restores the selection. With `allLabel`, an empty
 * first option for "any", also picked by emptying the box (as with `clearable`); with `recentKey`, the last picks are remembered under that storage key and listed first.
 */
@Component({
	selector: 'app-searchable-select',
	imports: [FormField],
	templateUrl: './searchable-select.component.html',
	host: { class: 'block' },
})
export class SearchableSelectComponent implements FormValueControl<string> {
	private static nextId = 0;
	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

	readonly value = model('');
	readonly options = input.required<readonly SelectOption[]>();
	readonly label = input.required<string>();
	/** Keeps the label for screen readers only. */
	readonly hideLabel = input(false);
	/** Text of the empty first option, such as "All wares"; also the placeholder while it is selected. */
	readonly allLabel = input<string>();
	readonly placeholder = input<string>();
	readonly inputId = input<string>();
	/** Storage key of the recently picked options, listed first; none without it. */
	readonly recentKey = input<string>();
	/** Emptying the box and leaving it (or pressing Enter) clears the value; always so with `allLabel`. */
	readonly clearable = input(false);
	/** Most options listed at once. */
	readonly limit = input(SelectOptionFilter.LIMIT);

	protected readonly listId = `app-searchable-select-${SearchableSelectComponent.nextId++}`;
	protected readonly id = computed(() => this.inputId() ?? `${this.listId}-input`);
	protected readonly shownPlaceholder = computed(() =>
		!this.value() && this.allLabel() !== undefined
			? this.allLabel()
			: (this.placeholder() ?? $localize`:@@select:( Select )`)
	);

	private readonly selectedName = computed(() => this.nameOf(this.value()));

	/** text in the box: the selected name, or what is typed */
	protected readonly query = linkedSignal(() => this.selectedName());
	protected readonly queryField = form(this.query);
	/** filters only once the user types, so opening lists every option */
	private readonly typing = signal(false);
	protected readonly open = signal(false);

	private readonly recent = linkedSignal(() => {
		const key = this.recentKey();
		return key ? RecentPicks.read(key) : [];
	});

	protected readonly matches = computed(() => {
		const allLabel = this.allLabel();
		return SelectOptionFilter.matches(this.options(), this.typing() ? this.query() : '', {
			pinned: this.recent(),
			pinnedGroup: $localize`Recent`,
			first: allLabel !== undefined ? { id: '', name: allLabel } : undefined,
			limit: this.limit(),
		});
	});

	/** highlighted option, back to none whenever the list changes */
	protected readonly activeIndex = linkedSignal({ source: this.matches, computation: () => -1 });
	protected readonly activeOptionId = computed(() =>
		this.open() && this.activeIndex() >= 0 ? this.optionId(this.activeIndex()) : null
	);

	constructor() {
		// keep the highlighted option in view
		effect(() => {
			const index = this.activeIndex();
			if (index >= 0) {
				this.host.nativeElement
					.querySelector(`[data-index="${index}"]`)
					?.scrollIntoView?.({ block: 'nearest' });
			}
		});
	}

	protected optionId(index: number) {
		return `${this.listId}-${index}`;
	}

	protected onFocus(event: FocusEvent) {
		this.open.set(true);
		// typing replaces the shown name
		(event.target as HTMLInputElement).select();
	}

	protected onInput() {
		this.typing.set(true);
		this.open.set(true);
	}

	protected onBlur() {
		// accept a fully typed option name, or an emptied box when clearable
		const match = this.typing() ? SelectOptionFilter.exactMatch(this.options(), this.query()) : undefined;
		if (match) {
			this.pick(match);
		} else if (this.isCleared()) {
			this.clear();
		} else {
			this.close();
		}
	}

	protected onKeydown(event: KeyboardEvent) {
		const options = this.matches().options;
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp': {
				event.preventDefault();
				this.open.set(true);
				if (options.length > 0) {
					const step = event.key === 'ArrowDown' ? 1 : -1;
					this.activeIndex.update((index) =>
						index < 0 && step < 0 ? options.length - 1 : (index + step + options.length) % options.length
					);
				}
				break;
			}
			case 'Enter': {
				if (this.open() && this.isCleared()) {
					event.preventDefault();
					this.clear();
					break;
				}
				const option =
					options[this.activeIndex()] ??
					(this.typing() ? SelectOptionFilter.exactMatch(options, this.query()) : undefined) ??
					(options.length === 1 ? options[0] : undefined);
				if (this.open() && option) {
					event.preventDefault();
					this.pick(option);
				}
				break;
			}
			case 'Tab': {
				const option = options[this.activeIndex()];
				if (this.open() && option) {
					this.pick(option);
				}
				break;
			}
			case 'Escape':
				if (this.open()) {
					event.preventDefault();
					this.close();
				}
				break;
		}
	}

	protected pick(option: SelectOption) {
		const key = this.recentKey();
		if (key && option.id) {
			this.recent.update((list) => RecentPicks.add(list, option.id));
			RecentPicks.write(key, this.recent());
		}
		this.value.set(option.id);
		this.close();
	}

	/** Whether the user emptied the box of a select that can be cleared. */
	private isCleared() {
		return (
			this.typing() && !this.query().trim() && (this.clearable() || this.allLabel() !== undefined)
		);
	}

	private clear() {
		this.value.set('');
		this.close();
	}

	/** Closes the list and shows the selected name again. */
	private close() {
		this.query.set(this.selectedName());
		this.typing.set(false);
		this.open.set(false);
		this.activeIndex.set(-1);
	}

	private nameOf(id: string): string {
		if (!id && this.allLabel() !== undefined) {
			return '';
		}
		return this.options().find((x) => x.id === id)?.name ?? '';
	}
}
