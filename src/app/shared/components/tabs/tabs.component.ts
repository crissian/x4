import { Component, ElementRef, computed, input, model, viewChildren } from '@angular/core';

/** One tab of `TabsComponent`. */
export interface TabItem<T extends string = string> {
	id: T;
	label: string;
	/** shown muted after the label, e.g. how many items the tab lists */
	count?: number;
}

/**
 * A tab strip with ARIA tabs semantics, above one panel holding the projected content of the selected tab.
 * Arrow keys, Home and End move between the tabs and select them; only the selected tab is in the tab order.
 */
@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.component.html',
})
export class TabsComponent<T extends string = string> {
	private static nextId = 0;

	readonly tabs = input.required<readonly TabItem<T>[]>();
	/** The selected tab id. */
	readonly selected = model.required<T>();
	/** Accessible name of the tab list. */
	readonly label = input<string>();

	protected readonly prefix = `app-tabs-${TabsComponent.nextId++}`;
	protected readonly panelId = `${this.prefix}-panel`;
	protected readonly selectedIndex = computed(() => this.tabs().findIndex((x) => x.id === this.selected()));

	private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('tab');

	tabId(id: T): string {
		return `${this.prefix}-tab-${id}`;
	}

	protected keydown(event: KeyboardEvent, index: number) {
		const count = this.tabs().length;
		const target = TabsComponent.KEYS[event.key]?.(index, count);
		if (target == null) {
			return;
		}
		event.preventDefault();
		this.selected.set(this.tabs()[target].id);
		this.buttons()[target]?.nativeElement.focus();
	}

	/** The tab index each navigation key moves to, from the current index and the tab count. */
	private static readonly KEYS: Record<string, (index: number, count: number) => number> = {
		ArrowRight: (index, count) => (index + 1) % count,
		ArrowLeft: (index, count) => (index - 1 + count) % count,
		Home: () => 0,
		End: (_, count) => count - 1,
	};
}
