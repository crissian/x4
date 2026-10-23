import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MoreFiltersComponent } from './more-filters.component';

@Component({
	imports: [MoreFiltersComponent],
	template: `<app-more-filters storageKey="test-more" [active]="active()"><span id="hidden-filter"></span></app-more-filters>`,
})
class HostComponent {
	readonly active = signal(0);
}

describe('MoreFiltersComponent', () => {
	beforeEach(() => localStorage.clear());

	function setup() {
		const fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
		const element: HTMLElement = fixture.nativeElement;
		const button = () => element.querySelector<HTMLButtonElement>('button')!;
		const shown = () => !!element.querySelector('#hidden-filter');
		const render = () => fixture.detectChanges();
		return { fixture, element, button, shown, render };
	}

	it('starts closed and remembers that it was opened', () => {
		const first = setup();
		expect(first.shown()).toBe(false);
		expect(first.button().getAttribute('aria-expanded')).toBe('false');
		first.button().click();
		first.render();
		expect(first.shown()).toBe(true);
		expect(localStorage.getItem('test-more')).toBe('true');

		const second = setup();
		expect(second.shown()).toBe(true);
	});

	it('opens by itself when a hidden filter is set, and can still be closed', () => {
		localStorage.setItem('test-more', 'false');
		const { fixture, button, shown, render } = setup();
		fixture.componentInstance.active.set(1);
		render();
		expect(shown()).toBe(true);
		button().click();
		render();
		expect(shown()).toBe(false);
		expect(localStorage.getItem('test-more')).toBe('false');
	});

	it('shows how many hidden filters are set while closed', () => {
		const { fixture, element, button, render } = setup();
		fixture.componentInstance.active.set(2);
		render();
		button().click();
		render();
		expect(element.querySelector('[data-active-count]')?.textContent?.trim()).toBe('2');
	});
});
