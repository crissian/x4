import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, form } from '@angular/forms/signals';
import { describe, expect, it } from 'vitest';
import { SectorInputComponent } from './sector-input.component';

@Component({
	imports: [SectorInputComponent, FormField],
	template: `<app-sector-input
		inputId="near"
		label="Near sector"
		placeholder="Anywhere"
		[sectors]="sectors"
		[formField]="field"
	/>`,
})
class HostComponent {
	readonly sectors = [
		{ id: 'a', name: 'Argon Prime' },
		{ id: 'b', name: 'Black Hole Sun', owner: 'teladi' },
	];
	readonly value = signal('Argon Prime');
	readonly field = form(this.value);
}

describe('SectorInputComponent', () => {
	async function setup() {
		const fixture = TestBed.createComponent(HostComponent);
		await fixture.whenStable();
		const element = fixture.nativeElement as HTMLElement;
		return { fixture, element, input: element.querySelector<HTMLInputElement>('#near')! };
	}

	it('shows the bound sector, labelled, with the placeholder', async () => {
		const { element, input } = await setup();
		expect(input.value).toBe('Argon Prime');
		expect(element.querySelector('label')?.textContent).toContain('Near sector');
		input.value = '';
		input.dispatchEvent(new Event('input'));
		expect(input.placeholder).toBe('Anywhere');
	});

	it('filters the sectors while typing and writes the picked name back to the form', async () => {
		const { fixture, element, input } = await setup();
		input.dispatchEvent(new FocusEvent('focus'));
		input.value = 'black';
		input.dispatchEvent(new Event('input'));
		await fixture.whenStable();
		const options = [...element.querySelectorAll('[role="option"]')].map((x) =>
			x.textContent?.trim().replace(/\s+/g, ' ')
		);
		expect(options).toEqual(['Black Hole Sun Teladi Company']);
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
		await fixture.whenStable();
		expect(fixture.componentInstance.value()).toBe('Black Hole Sun');
	});

	it('finds sectors by their owner faction', async () => {
		const { fixture, element, input } = await setup();
		input.dispatchEvent(new FocusEvent('focus'));
		input.value = 'teladi';
		input.dispatchEvent(new Event('input'));
		await fixture.whenStable();
		expect(element.querySelectorAll('[role="option"]').length).toBe(1);
	});

	it('clears the value when the box is emptied', async () => {
		const { fixture, input } = await setup();
		input.dispatchEvent(new FocusEvent('focus'));
		input.value = '';
		input.dispatchEvent(new Event('input'));
		input.dispatchEvent(new FocusEvent('blur'));
		await fixture.whenStable();
		expect(fixture.componentInstance.value()).toBe('');
	});
});
