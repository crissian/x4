import {
	Component,
	DestroyRef,
	ElementRef,
	afterNextRender,
	computed,
	effect,
	inject,
	input,
	signal,
	viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideDynamicIcon, LucideMenu } from '@lucide/angular';
import { filter } from 'rxjs/operators';
import { NavDropdownComponent } from './nav-dropdown.component';
import { NavItems, type NavItem } from './nav-item';

/**
 * The main links and link groups: in a row while they fit next to the header controls, else behind a menu button. The row width
 * depends on the language, so it is measured rather than tied to a breakpoint.
 */
@Component({
	selector: 'app-header-nav',
	imports: [RouterLink, RouterLinkActive, LucideDynamicIcon, LucideMenu, NavDropdownComponent],
	templateUrl: './header-nav.component.html',
	host: {
		'(document:keydown.escape)': 'closeMenu(true)',
		'(document:click)': 'onDocumentClick($event)',
	},
})
export class HeaderNavComponent {
	readonly items = input.required<NavItem[]>();
	protected readonly NavItems = NavItems;

	/** The menu lists the plain links first, then each group under its label. */
	protected readonly sections = computed(() => {
		const items = this.items();
		return [
			{ label: '', links: items.filter(NavItems.isLink), experimental: false },
			...items.filter(NavItems.isGroup),
		];
	});

	protected readonly url = signal(inject(Router).url);
	/** Label of the open dropdown; only one is open at a time. */
	protected readonly openGroup = signal<string | null>(null);

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
		const router = inject(Router);
		router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				takeUntilDestroyed()
			)
			.subscribe(() => {
				this.menuOpen.set(false);
				this.openGroup.set(null);
				this.url.set(router.url);
			});
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

	protected setGroupOpen(label: string, open: boolean) {
		if (open) {
			this.openGroup.set(label);
		} else if (this.openGroup() === label) {
			this.openGroup.set(null);
		}
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
			// the row's own width: an open dropdown panel inside it would inflate scrollWidth
			this.rowWidth = row.offsetWidth;
		}
		const available = this.space().nativeElement.clientWidth;
		if (this.collapsed()) {
			if (this.rowWidth <= available) {
				this.collapsed.set(false);
				this.menuOpen.set(false);
			}
		} else if (this.rowWidth > available) {
			this.collapsed.set(true);
			this.openGroup.set(null);
		}
	}
}
