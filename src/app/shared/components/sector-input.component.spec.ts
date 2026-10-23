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
		{ id: 'b', name: 'Black Hole Sun' },
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

	it('suggests the sector names and shows the bound value', async () => {
		const { element, input } = await setup();
		expect(input.value).toBe('Argon Prime');
		expect(input.placeholder).toBe('Anywhere');
		expect(element.querySelector('label')?.textContent).toContain('Near sector');
		const list = element.querySelector(`datalist#${input.getAttribute('list')}`);
		expect([...list!.querySelectorAll('option')].map((x) => x.value)).toEqual(['Argon Prime', 'Black Hole Sun']);
	});

	it('writes typed text back to the form', async () => {
		const { fixture, input } = await setup();
		input.value = 'Black Hole Sun';
		input.dispatchEvent(new Event('input'));
		await fixture.whenStable();
		expect(fixture.componentInstance.value()).toBe('Black Hole Sun');
	});
});
