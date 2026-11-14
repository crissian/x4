import { DialogRef } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LayoutService } from '../services/layout-service';
import { LoadLayoutComponent } from './load-layout.component';

describe('load layout batch delete', () => {
	const close = vi.fn();

	beforeEach(() => {
		localStorage.clear();
		close.mockClear();
		TestBed.configureTestingModule({ providers: [{ provide: DialogRef, useValue: { close } }] });
		const service = TestBed.inject(LayoutService);
		for (const name of ['Food', 'Energy', 'Water']) {
			service.saveLayout({ name, config: [] });
		}
	});

	afterEach(() => document.querySelector('.cdk-overlay-container')?.replaceChildren());

	function setup() {
		const fixture = TestBed.createComponent(LoadLayoutComponent);
		fixture.detectChanges();
		const element = fixture.nativeElement as HTMLElement;
		const checkboxes = () =>
			Array.from(element.querySelectorAll<HTMLInputElement>('div.divide-y input[type="checkbox"]'));
		return { fixture, element, checkboxes };
	}

	it('checking a layout does not load it', () => {
		const { fixture, checkboxes } = setup();
		checkboxes()[0].click();
		fixture.detectChanges();
		expect(close).not.toHaveBeenCalled();
		expect(fixture.componentInstance.selected().size).toBe(1);
	});

	it('select all checks every layout', () => {
		const { fixture, element } = setup();
		element.querySelector<HTMLInputElement>('input[type="checkbox"]')?.click();
		fixture.detectChanges();
		expect(fixture.componentInstance.allSelected()).toBe(true);
	});

	it('select all shows as partially selected when only some layouts are checked', () => {
		const { fixture, element, checkboxes } = setup();
		const selectAll = element.querySelector<HTMLInputElement>('input[type="checkbox"]');
		checkboxes()[0].click();
		fixture.detectChanges();
		expect(selectAll?.indeterminate).toBe(true);
		expect(selectAll?.checked).toBe(false);

		checkboxes()[1].click();
		checkboxes()[2].click();
		fixture.detectChanges();
		expect(selectAll?.indeterminate).toBe(false);
		expect(selectAll?.checked).toBe(true);
	});

	it('deletes only the selected layouts after confirming', async () => {
		const { fixture, checkboxes } = setup();
		checkboxes()[0].click();
		checkboxes()[2].click();
		fixture.componentInstance.deleteSelected();
		await fixture.whenStable();

		document.querySelector<HTMLButtonElement>('.cdk-overlay-container .btn-primary')?.click();
		await fixture.whenStable();
		fixture.detectChanges();

		expect(
			TestBed.inject(LayoutService)
				.getLayouts()
				.map((x) => x.name)
		).toEqual(['Food']);
		expect(fixture.componentInstance.selected().size).toBe(0);
	});

	it('keeps the layouts when the confirmation is declined', async () => {
		const { fixture, checkboxes } = setup();
		checkboxes()[0].click();
		fixture.componentInstance.deleteSelected();
		await fixture.whenStable();

		document.querySelector<HTMLButtonElement>('.cdk-overlay-container .btn-secondary')?.click();
		await fixture.whenStable();

		expect(TestBed.inject(LayoutService).getLayouts().length).toBe(3);
	});
});
