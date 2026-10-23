import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, form } from '@angular/forms/signals';
import { afterEach, describe, expect, it } from 'vitest';
import { RecentPicks } from './recent-picks';
import { SearchableSelectComponent } from './searchable-select.component';

@Component({
	imports: [SearchableSelectComponent, FormField],
	templateUrl: './searchable-select.component.spec.html',
})
class HostComponent {
	readonly ships = [
		{ id: 'own-1', name: 'Hauler One', group: 'Your ships', detail: 'Mercury · Argon Prime' },
		{ id: 'ship_mercury', name: 'Mercury', group: 'Ship models' },
		{ id: 'ship_demeter', name: 'Demeter', group: 'Ship models' },
	];
	readonly value = signal('ship_mercury');
	readonly field = form(this.value);
	readonly allLabel = signal<string | undefined>(undefined);
	readonly recentKey = signal<string | undefined>(undefined);
	readonly clearable = signal(false);
}

describe('SearchableSelectComponent', () => {
	afterEach(() => localStorage.clear());

	async function setup(
		options: { value?: string; allLabel?: string; recentKey?: string; clearable?: boolean } = {}
	) {
		const fixture = TestBed.createComponent(HostComponent);
		const host = fixture.componentInstance;
		if (options.value !== undefined) {
			host.value.set(options.value);
		}
		host.allLabel.set(options.allLabel);
		host.recentKey.set(options.recentKey);
		host.clearable.set(options.clearable ?? false);
		await fixture.whenStable();
		const element = fixture.nativeElement as HTMLElement;
		const input = element.querySelector<HTMLInputElement>('#ship')!;
		const options_ = () =>
			[...element.querySelectorAll('[role="option"]')].map((x) => x.textContent?.trim().replace(/\s+/g, ' '));
		const headers = () => [...element.querySelectorAll('[role="presentation"]')].map((x) => x.textContent?.trim());
		const key = async (name: string) => {
			input.dispatchEvent(new KeyboardEvent('keydown', { key: name, cancelable: true }));
			await fixture.whenStable();
		};
		const type = async (text: string) => {
			input.value = text;
			input.dispatchEvent(new Event('input'));
			await fixture.whenStable();
		};
		const focus = async () => {
			input.dispatchEvent(new FocusEvent('focus'));
			await fixture.whenStable();
		};
		return { fixture, host, element, input, options: options_, headers, key, type, focus };
	}

	it('shows the selected name, labelled, with the list closed', async () => {
		const { element, input } = await setup();
		expect(input.value).toBe('Mercury');
		expect(element.querySelector('label')?.textContent).toContain('Ship');
		expect(input.getAttribute('aria-expanded')).toBe('false');
		expect(element.querySelector('[role="listbox"]')).toBeNull();
	});

	it('lists every option by group when focused, and filters on typing', async () => {
		const { input, options, headers, focus, type } = await setup();
		await focus();
		expect(input.getAttribute('aria-expanded')).toBe('true');
		expect(headers()).toEqual(['Your ships', 'Ship models']);
		expect(options()).toEqual(['Hauler One Mercury · Argon Prime', 'Mercury', 'Demeter']);
		await type('argon');
		expect(options()).toEqual(['Hauler One Mercury · Argon Prime']);
		await type('zzz');
		expect(options()).toEqual([]);
		expect(input.parentElement?.textContent).toContain('No matches');
	});

	it('picks with the arrow keys and Enter, writing the form value', async () => {
		const { host, input, focus, key } = await setup();
		await focus();
		await key('ArrowDown');
		await key('ArrowDown');
		expect(input.getAttribute('aria-activedescendant')).toMatch(/-1$/);
		await key('Enter');
		expect(host.value()).toBe('ship_mercury');
		await focus();
		await key('ArrowUp');
		await key('Enter');
		expect(host.value()).toBe('ship_demeter');
		expect(input.value).toBe('Demeter');
		expect(input.getAttribute('aria-expanded')).toBe('false');
	});

	it('picks a clicked option', async () => {
		const { fixture, host, element, input, focus } = await setup();
		await focus();
		element.querySelectorAll<HTMLElement>('[role="option"]')[0].click();
		await fixture.whenStable();
		expect(host.value()).toBe('own-1');
		expect(input.value).toBe('Hauler One');
	});

	it('restores the selection on Escape and on leaving without a match', async () => {
		const { fixture, host, input, focus, type, key } = await setup();
		await focus();
		await type('Dem');
		await key('Escape');
		expect(input.value).toBe('Mercury');
		expect(input.getAttribute('aria-expanded')).toBe('false');
		await focus();
		await type('Dem');
		input.dispatchEvent(new FocusEvent('blur'));
		await fixture.whenStable();
		expect(input.value).toBe('Mercury');
		expect(host.value()).toBe('ship_mercury');
	});

	it('accepts a fully typed name', async () => {
		const { fixture, host, input, focus, type } = await setup();
		await focus();
		await type('demeter');
		input.dispatchEvent(new FocusEvent('blur'));
		await fixture.whenStable();
		expect(host.value()).toBe('ship_demeter');
	});

	it('clears the value when emptied and left, if clearable', async () => {
		const { fixture, host, input, focus, type, key } = await setup({ clearable: true });
		await focus();
		await type('');
		input.dispatchEvent(new FocusEvent('blur'));
		await fixture.whenStable();
		expect(host.value()).toBe('');
		expect(input.value).toBe('');
		host.value.set('ship_demeter');
		await fixture.whenStable();
		await focus();
		await type(' ');
		await key('Enter');
		expect(host.value()).toBe('');
	});

	it('keeps the value when emptied and left, if not clearable', async () => {
		const { fixture, host, input, focus, type } = await setup();
		await focus();
		await type('');
		input.dispatchEvent(new FocusEvent('blur'));
		await fixture.whenStable();
		expect(host.value()).toBe('ship_mercury');
		expect(input.value).toBe('Mercury');
	});

	it('offers the empty "all" option, shown as the placeholder while selected', async () => {
		const { host, input, options, focus, key } = await setup({ value: '', allLabel: 'Any ship' });
		expect(input.value).toBe('');
		expect(input.placeholder).toBe('Any ship');
		await focus();
		expect(options()[0]).toBe('Any ship');
		await key('ArrowDown');
		await key('ArrowDown');
		await key('Enter');
		expect(host.value()).toBe('own-1');
		await focus();
		await key('ArrowDown');
		await key('Enter');
		expect(host.value()).toBe('');
	});

	it('remembers picks under the recent key and lists them first', async () => {
		RecentPicks.write('test-recent', ['ship_demeter']);
		const { host, headers, options, focus, key } = await setup({ recentKey: 'test-recent' });
		await focus();
		expect(headers()).toEqual(['Recent', 'Your ships', 'Ship models']);
		expect(options()).toEqual(['Demeter', 'Hauler One Mercury · Argon Prime', 'Mercury']);
		await key('ArrowDown');
		await key('ArrowDown');
		await key('Enter');
		expect(host.value()).toBe('own-1');
		expect(RecentPicks.read('test-recent')).toEqual(['own-1', 'ship_demeter']);
	});
});
