import { Component, DestroyRef, ElementRef, afterNextRender, effect, inject, input, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideDynamicIcon, LucideMenu, type LucideIconInput } from '@lucide/angular';
import { filter } from 'rxjs/operators';

export interface NavLink {
	path: string;
	label: string;
	icon: LucideIconInput;
}

/**
 * The main links: in a row while they fit next to the header controls, else behind a menu button. The row width
 * depends on the language, so it is measured rather than tied to a breakpoint.
 */
@Component({
	selector: 'app-header-nav',
	imports: [RouterLink, RouterLinkActive, LucideDynamicIcon, LucideMenu],
	templateUrl: './header-nav.component.html',
	host: {
		'(document:keydown.escape)': 'closeMenu(true)',
		'(document:click)': 'onDocumentClick($event)',
	},
})
export class HeaderNavComponent {
	readonly links = input.required<NavLink[]>();

	/** The links do not fit in a row, so a menu button shows them. */
	protected readonly collapsed = signal(false);
	protected readonly menuOpen = signal(false);

	private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
	private readonly space = viewChild.required<ElementRef<HTMLElement>>('space');
	private readonly row = viewChild<ElementRef<HTMLElement>>('row');
	private readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');
	private readonly observer = signal<ResizeObserver | null>(null);
	/** width the link row needs, measured while it shows */
	private rowWidth = 0;

	constructor() {
		const destroyRef = inject(DestroyRef);
		inject(Router)
			.events.pipe(
				filter((event) => event instanceof NavigationEnd),
				takeUntilDestroyed()
			)
			.subscribe(() => this.menuOpen.set(false));
		afterNextRender(() => {
			const observer = new ResizeObserver(() => this.fit());
			observer.observe(this.space().nativeElement);
			this.observer.set(observer);
			destroyRef.onDestroy(() => observer.disconnect());
		});
		// the row width changes with the fonts loading, and the row comes back when there is room again
		effect((onCleanup) => {
			const observer = this.observer();
			const row = this.row()?.nativeElement;
			if (observer && row) {
				observer.observe(row);
				onCleanup(() => observer.unobserve(row));
			}
		});
	}

	protected toggleMenu() {
		this.menuOpen.update((open) => !open);
	}

	/** Closes the menu; `refocus` moves the focus back to the menu button (Escape). */
	closeMenu(refocus = false) {
		if (!this.menuOpen()) {
			return;
		}
		this.menuOpen.set(false);
		if (refocus) {
			this.menuButton()?.nativeElement.focus();
		}
	}

	protected onDocumentClick(event: MouseEvent) {
		if (!this.element.contains(event.target as Node)) {
			this.closeMenu();
		}
	}

	/** Shows the row when it fits the space left by the header controls, else the menu button. */
	private fit() {
		const row = this.row()?.nativeElement;
		if (row) {
			this.rowWidth = row.scrollWidth;
		}
		const available = this.space().nativeElement.clientWidth;
		if (this.collapsed()) {
			if (this.rowWidth <= available) {
				this.collapsed.set(false);
				this.menuOpen.set(false);
			}
		} else if (this.rowWidth > available) {
			this.collapsed.set(true);
		}
	}
}
