import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TabItem, TabsComponent } from './tabs.component';

@Component({
	imports: [TabsComponent],
	template: `<app-tabs label="Sections" [tabs]="tabs" [(selected)]="selected"
		><p>{{ selected() }}</p></app-tabs
	>`,
})
class HostComponent {
	readonly tabs: TabItem[] = [
		{ id: 'a', label: 'Alpha' },
		{ id: 'b', label: 'Beta', count: 3 },
		{ id: 'c', label: 'Gamma' },
	];
	readonly selected = signal('b');
}

describe('TabsComponent', () => {
	async function setup() {
		const fixture = TestBed.createComponent(HostComponent);
		await fixture.whenStable();
		const element = fixture.nativeElement as HTMLElement;
		const tabs = () => [...element.querySelectorAll<HTMLButtonElement>('[role=tab]')];
		const key = async (key: string) => {
			const active = tabs().find((x) => x.getAttribute('aria-selected') === 'true');
			active?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
			await fixture.whenStable();
		};
		return { fixture, element, tabs, key };
	}

	it('marks up the tabs and the panel with ARIA tab semantics', async () => {
		const { element, tabs } = await setup();
		const list = element.querySelector('[role=tablist]');
		const panel = element.querySelector('[role=tabpanel]');
		expect(list?.getAttribute('aria-label')).toBe('Sections');
		expect(tabs().map((x) => x.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false']);
		expect(tabs().map((x) => x.tabIndex)).toEqual([-1, 0, -1]);
		expect(tabs().every((x) => x.getAttribute('aria-controls') === panel?.id)).toBe(true);
		expect(panel?.getAttribute('aria-labelledby')).toBe(tabs()[1].id);
		expect(tabs()[1].textContent).toContain('3');
		expect(panel?.textContent).toContain('b');
	});

	it('selects a clicked tab', async () => {
		const { fixture, tabs } = await setup();
		tabs()[2].click();
		await fixture.whenStable();
		expect(fixture.componentInstance.selected()).toBe('c');
		expect(tabs()[2].getAttribute('aria-selected')).toBe('true');
		expect(tabs()[2].tabIndex).toBe(0);
	});

	it('moves the selection and the focus with the arrow keys, Home and End', async () => {
		const { fixture, tabs, key } = await setup();
		const selected = () => fixture.componentInstance.selected();
		await key('ArrowRight');
		expect(selected()).toBe('c');
		expect(document.activeElement).toBe(tabs()[2]);
		await key('ArrowRight');
		expect(selected()).toBe('a');
		await key('ArrowLeft');
		expect(selected()).toBe('c');
		await key('Home');
		expect(selected()).toBe('a');
		await key('End');
		expect(selected()).toBe('c');
		await key('Enter');
		expect(selected()).toBe('c');
	});
});
