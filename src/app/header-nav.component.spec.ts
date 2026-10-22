import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { LucidePackage } from '@lucide/angular';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HeaderNavComponent } from './header-nav.component';
import type { NavItem } from './nav-item';

@Component({ template: '' })
class PageComponent {}

const ICON = LucidePackage;
const ITEMS: NavItem[] = [
	{ path: '/calc', label: 'Calc', icon: ICON },
	{
		label: 'Database',
		icon: ICON,
		links: [
			{ path: '/wares', label: 'Wares', icon: ICON },
			{ path: '/ships', label: 'Ships', icon: ICON },
		],
	},
	{
		label: 'Economy',
		icon: ICON,
		links: [{ path: '/trade-routes', label: 'Trade Routes', icon: ICON }],
	},
];

describe('header nav', () => {
	/** the ResizeObserver callbacks of the component, to fire a resize by hand */
	const callbacks: (() => void)[] = [];
	let fixture: ComponentFixture<HeaderNavComponent>;
	let element: HTMLElement;
	let router: Router;

	const buttons = () => [...element.querySelectorAll<HTMLButtonElement>('app-nav-dropdown > button')];
	const panels = () => [...element.querySelectorAll('app-nav-dropdown [id^="app-nav-dropdown-"]')];
	const settle = () => fixture.whenStable();
	const navigate = async (url: string) => {
		await router.navigateByUrl(url);
		await settle();
	};
	/** Stubs the measured widths and fires the resize. `scroll` is what an open panel inflates. */
	const resize = async (row: number, available: number, scroll = row) => {
		const nav = element.querySelector<HTMLElement>('nav');
		if (nav) {
			Object.defineProperty(nav, 'offsetWidth', { value: row, configurable: true });
			Object.defineProperty(nav, 'scrollWidth', { value: scroll, configurable: true });
		}
		const space = element.querySelector<HTMLElement>('app-header-nav > div, :scope > div')!;
		Object.defineProperty(space, 'clientWidth', { value: available, configurable: true });
		callbacks.forEach((callback) => callback());
		await settle();
	};
	const menuButton = () => element.querySelector('button[aria-controls="app-nav-menu"]');
	const press = async (target: EventTarget, key: string) => {
		target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
		await settle();
	};

	beforeEach(async () => {
		callbacks.length = 0;
		vi.stubGlobal(
			'ResizeObserver',
			class {
				constructor(callback: () => void) {
					callbacks.push(callback);
				}
				observe = vi.fn();
				unobserve = vi.fn();
				disconnect = vi.fn();
			}
		);
		TestBed.configureTestingModule({
			providers: [
				provideRouter(
					['wares', 'wares/:id', 'ships', 'saves', 'trade-routes', 'calc'].map((path) => ({
						path,
						component: PageComponent,
					}))
				),
			],
		});
		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(HeaderNavComponent);
		fixture.componentRef.setInput('items', ITEMS);
		element = fixture.nativeElement;
		await settle();
	});

	afterEach(() => vi.unstubAllGlobals());

	it('renders plain links and one button per group', () => {
		expect([...element.querySelectorAll('nav > a')].map((a) => a.textContent!.trim())).toEqual(['Calc']);
		expect(buttons().map((b) => b.textContent!.trim())).toEqual(['Database', 'Economy']);
		expect(buttons().map((b) => b.getAttribute('aria-expanded'))).toEqual(['false', 'false']);
		expect(panels().length).toBe(0);
	});

	it('toggles a dropdown with its links and aria attributes', async () => {
		buttons()[0].click();
		await settle();
		expect([...panels()[0].querySelectorAll('a')].map((a) => a.textContent!.trim())).toEqual(['Wares', 'Ships']);
		expect(buttons()[0].getAttribute('aria-expanded')).toBe('true');
		expect(buttons()[0].getAttribute('aria-controls')).toBe(panels()[0].id);
		buttons()[0].click();
		await settle();
		expect(panels().length).toBe(0);
	});

	it('marks a group active while the route is inside one of its links', async () => {
		await navigate('/wares/ec');
		expect(buttons()[0].className).toContain('bg-nav-active');
		expect(buttons()[1].className).not.toContain('bg-nav-active');
		await navigate('/trade-routes');
		expect(buttons()[0].className).not.toContain('bg-nav-active');
		expect(buttons()[1].className).toContain('bg-nav-active');
	});

	it('keeps only one dropdown open', async () => {
		buttons()[0].click();
		await settle();
		buttons()[1].click();
		await settle();
		expect(panels().length).toBe(1);
		expect(panels()[0].textContent).toContain('Trade Routes');
	});

	it('closes on Escape and returns the focus to the button', async () => {
		buttons()[1].click();
		await settle();
		const link = panels()[0].querySelector('a')!;
		link.focus();
		expect(document.activeElement).toBe(link);
		await press(document, 'Escape');
		expect(panels().length).toBe(0);
		expect(document.activeElement).toBe(buttons()[1]);
	});

	it('closes on an outside click but not on a click inside', async () => {
		buttons()[0].click();
		await settle();
		panels()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await settle();
		expect(panels().length).toBe(1);
		document.body.click();
		await settle();
		expect(panels().length).toBe(0);
	});

	it('closes on navigation', async () => {
		buttons()[0].click();
		await settle();
		await navigate('/calc');
		expect(panels().length).toBe(0);
	});

	it('opens with Arrow Down and moves between the links', async () => {
		await press(buttons()[0], 'ArrowDown');
		const links = [...panels()[0].querySelectorAll('a')];
		expect(document.activeElement).toBe(links[0]);
		await press(links[0], 'ArrowDown');
		expect(document.activeElement).toBe(links[1]);
		await press(links[1], 'ArrowUp');
		expect(document.activeElement).toBe(links[0]);
	});

	it('collapses when the row is too wide and restores when there is room', async () => {
		await resize(900, 500);
		expect(menuButton()).not.toBeNull();
		expect(element.querySelector('nav')).toBeNull();
		await resize(900, 1000);
		expect(menuButton()).toBeNull();
		expect(element.querySelector('nav')).not.toBeNull();
	});

	it('measures the row, not an open dropdown panel inside it', async () => {
		buttons()[1].click();
		await settle();
		// the row fits, but the open panel makes its scroll width larger than the space
		await resize(400, 500, 900);
		expect(menuButton()).toBeNull();
		expect(panels().length).toBe(1);
	});

	it('lists the plain links first and then each group under its heading when collapsed', async () => {
		await resize(900, 500);
		menuButton()!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await settle();
		const menu = element.querySelector('#app-nav-menu')!;
		expect([...menu.children].map((child) => child.textContent!.trim())).toEqual([
			'Calc',
			'Database',
			'Wares',
			'Ships',
			'Economy',
			'Trade Routes',
		]);
		expect(element.querySelectorAll('app-nav-dropdown').length).toBe(0);
	});

	it('wraps the arrow keys around the links', async () => {
		await press(buttons()[0], 'ArrowDown');
		const links = [...panels()[0].querySelectorAll('a')];
		await press(links[0], 'ArrowUp');
		expect(document.activeElement).toBe(links[1]);
		await press(links[1], 'ArrowDown');
		expect(document.activeElement).toBe(links[0]);
	});

	it('closes only the open group on Escape', async () => {
		buttons()[0].click();
		await settle();
		await press(document, 'Escape');
		expect(buttons().map((b) => b.getAttribute('aria-expanded'))).toEqual(['false', 'false']);
		expect(document.activeElement).toBe(buttons()[0]);
		buttons()[1].focus();
		await press(document, 'Escape');
		expect(document.activeElement).toBe(buttons()[1]);
	});

	it('marks the active group with aria-current', async () => {
		await navigate('/wares');
		expect(buttons().map((b) => b.getAttribute('aria-current'))).toEqual(['true', null]);
	});

	describe('hover', () => {
		const pointer = async (target: Element, type: string, pointerType = 'mouse') => {
			target.dispatchEvent(new PointerEvent(type, { pointerType, bubbles: false }));
			fixture.detectChanges();
		};
		const hosts = () => [...element.querySelectorAll('app-nav-dropdown')];

		afterEach(() => vi.useRealTimers());

		it('opens on a mouse hover and closes after the leave delay', async () => {
			vi.useFakeTimers();
			await pointer(hosts()[0], 'pointerenter');
			expect(panels().length).toBe(1);
			await pointer(hosts()[0], 'pointerleave');
			await vi.advanceTimersByTimeAsync(100);
			fixture.detectChanges();
			expect(panels().length).toBe(1);
			await vi.advanceTimersByTimeAsync(100);
			fixture.detectChanges();
			expect(panels().length).toBe(0);
		});

		it('stays open when the mouse comes back before the delay', async () => {
			vi.useFakeTimers();
			await pointer(hosts()[0], 'pointerenter');
			await pointer(hosts()[0], 'pointerleave');
			await vi.advanceTimersByTimeAsync(50);
			await pointer(hosts()[0], 'pointerenter');
			await vi.advanceTimersByTimeAsync(300);
			fixture.detectChanges();
			expect(panels().length).toBe(1);
		});

		it('does not close a group the mouse entered again after leaving another', async () => {
			vi.useFakeTimers();
			await pointer(hosts()[0], 'pointerenter');
			await pointer(hosts()[0], 'pointerleave');
			await pointer(hosts()[1], 'pointerenter');
			await vi.advanceTimersByTimeAsync(200);
			fixture.detectChanges();
			expect(buttons().map((b) => b.getAttribute('aria-expanded'))).toEqual(['false', 'true']);
		});

		it('clears the leave timer on destroy', async () => {
			vi.useFakeTimers();
			await pointer(hosts()[0], 'pointerenter');
			await pointer(hosts()[0], 'pointerleave');
			const clear = vi.spyOn(globalThis, 'clearTimeout');
			fixture.destroy();
			expect(clear).toHaveBeenCalled();
			await vi.advanceTimersByTimeAsync(300);
			expect(buttons().length).toBe(2);
		});

		it('keeps the dropdown open on leave while the focus is inside', async () => {
			vi.useFakeTimers();
			await pointer(hosts()[0], 'pointerenter');
			panels()[0].querySelector('a')!.focus();
			await pointer(hosts()[0], 'pointerleave');
			await vi.advanceTimersByTimeAsync(300);
			fixture.detectChanges();
			expect(panels().length).toBe(1);
		});

		it('switches to the group the mouse enters', async () => {
			await pointer(hosts()[0], 'pointerenter');
			await pointer(hosts()[1], 'pointerenter');
			expect(panels().length).toBe(1);
			expect(buttons().map((b) => b.getAttribute('aria-expanded'))).toEqual(['false', 'true']);
		});

		it('keeps the dropdown open when the button is clicked after the hover', async () => {
			await pointer(hosts()[0], 'pointerenter');
			buttons()[0].dispatchEvent(new PointerEvent('click', { pointerType: 'mouse', bubbles: true }));
			await settle();
			expect(panels().length).toBe(1);
		});

		it('ignores touch pointers on hover and still toggles on tap', async () => {
			await pointer(hosts()[0], 'pointerenter', 'touch');
			expect(panels().length).toBe(0);
			buttons()[0].dispatchEvent(new PointerEvent('click', { pointerType: 'touch', bubbles: true }));
			await settle();
			expect(panels().length).toBe(1);
			buttons()[0].dispatchEvent(new PointerEvent('click', { pointerType: 'touch', bubbles: true }));
			await settle();
			expect(panels().length).toBe(0);
		});
	});
});
