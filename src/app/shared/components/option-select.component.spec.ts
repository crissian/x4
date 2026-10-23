import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, form } from '@angular/forms/signals';
import { describe, expect, it } from 'vitest';
import { OptionSelectComponent } from './option-select.component';

@Component({
	imports: [OptionSelectComponent, FormField],
	template: `<app-option-select
		inputId="ware"
		label="Ware"
		allLabel="All wares"
		[options]="wares"
		[formField]="field"
	/>`,
})
class HostComponent {
	readonly wares = [
		{ id: 'energycells', name: 'Energy Cells' },
		{ id: 'water', name: 'Water' },
	];
	readonly value = signal('water');
	readonly field = form(this.value);
}

describe('OptionSelectComponent', () => {
	async function setup() {
		const fixture = TestBed.createComponent(HostComponent);
		await fixture.whenStable();
		const element = fixture.nativeElement as HTMLElement;
		return { fixture, element, select: element.querySelector<HTMLSelectElement>('#ware')! };
	}

	it('lists the "all" option and the options, with the bound one selected', async () => {
		const { element, select } = await setup();
		expect([...select.options].map((x) => x.textContent?.trim())).toEqual(['All wares', 'Energy Cells', 'Water']);
		expect(select.value).toBe('water');
		expect(element.querySelector('label')?.textContent).toContain('Ware');
	});

	it('writes the chosen option back to the form', async () => {
		const { fixture, select } = await setup();
		select.value = '';
		select.dispatchEvent(new Event('input'));
		await fixture.whenStable();
		expect(fixture.componentInstance.value()).toBe('');
	});
});
