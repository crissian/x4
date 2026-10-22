import {
	Component,
	DestroyRef,
	ElementRef,
	Injector,
	afterNextRender,
	computed,
	inject,
	input,
	output,
	viewChild,
	viewChildren,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideChevronDown, LucideDynamicIcon } from '@lucide/angular';
import type { NavGroup } from './nav-item';

/** A header button that toggles a panel of links. The parent owns the open state, so only one panel is open. */
@Component({
	selector: 'app-nav-dropdown',
	imports: [RouterLink, RouterLinkActive, LucideDynamicIcon, LucideChevronDown],
	templateUrl: './nav-dropdown.component.html',
	host: {
		class: 'relative',
		'(document:keydown.escape)': 'onEscape()',
		'(document:click)': 'onDocumentClick($event)',
		'(pointerenter)': 'onPointerEnter($event)',
		'(pointerleave)': 'onPointerLeave($event)',
	},
})
export class NavDropdownComponent {
	private static nextId = 0;
	private static readonly LEAVE_DELAY = 150;

	readonly group = input.required<NavGroup>();
	/** The current url: the group is re-checked when it changes. */
	readonly url = input.required<string>();
	readonly open = input(false);
	readonly openChange = output<boolean>();

	protected readonly panelId = `app-nav-dropdown-${NavDropdownComponent.nextId++}`;

	private leaveTimer: ReturnType<typeof setTimeout> | undefined;
	private readonly cleanup = inject(DestroyRef).onDestroy(() => clearTimeout(this.leaveTimer));
	private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
	private readonly injector = inject(Injector);
	private readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('button');
	private readonly items = viewChildren<ElementRef<HTMLAnchorElement>>('item');

	/** The route is inside one of the links, so `/wares/:id` counts for `/wares`. */
	protected readonly active = computed(() => {
		const path = this.url().split(/[?#;]/)[0];
		return this.group().links.some((link) => path === link.path || path.startsWith(link.path + '/'));
	});

	/** A mouse opens the dropdown on hover (and the parent closes the others); touch keeps tapping the button. */
	protected onPointerEnter(event: PointerEvent) {
		if (event.pointerType === 'mouse') {
			clearTimeout(this.leaveTimer);
			this.openChange.emit(true);
		}
	}

	/** The short delay lets the mouse cross from the button into the panel. */
	protected onPointerLeave(event: PointerEvent) {
		if (event.pointerType === 'mouse' && !this.element.contains(document.activeElement)) {
			this.leaveTimer = setTimeout(() => this.openChange.emit(false), NavDropdownComponent.LEAVE_DELAY);
		}
	}

	/** A mouse click keeps the dropdown the hover opened; a tap or key toggles it. */
	protected onButtonClick(event: MouseEvent) {
		this.openChange.emit((event as PointerEvent).pointerType === 'mouse' || !this.open());
	}

	protected onEscape() {
		if (this.open()) {
			this.openChange.emit(false);
			this.button().nativeElement.focus();
		}
	}

	protected onDocumentClick(event: MouseEvent) {
		if (this.open() && !this.element.contains(event.target as Node)) {
			this.openChange.emit(false);
		}
	}

	/** Arrow Down on the button opens the panel and focuses its first link. */
	protected onButtonArrowDown(event: Event) {
		event.preventDefault();
		if (this.open()) {
			this.focusItem(0);
		} else {
			this.openChange.emit(true);
			afterNextRender(() => this.focusItem(0), { injector: this.injector });
		}
	}

	/** Up and Down move between the links, wrapping around. */
	protected onItemArrow(event: Event, step: number) {
		event.preventDefault();
		const items = this.items();
		const index = items.findIndex((item) => item.nativeElement === document.activeElement);
		this.focusItem((index + step + items.length) % items.length);
	}

	private focusItem(index: number) {
		this.items()[index]?.nativeElement.focus();
	}
}
