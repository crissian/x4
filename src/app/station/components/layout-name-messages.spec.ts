import { DialogRef } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, describe, expect, it } from 'vitest';
import { Layout } from '../../shared/services/module-config';
import { LayoutService } from '../services/layout-service';
import { LoadLayoutComponent } from './load-layout.component';
import { SaveLayoutComponent } from './save-layout.component';
import StationCalculatorComponent from './station-calculator.component';

/** A user-typed layout name that HTML would mangle. */
const NAME = 'Docks <b>& co';

describe('layout name messages', () => {
	function setup() {
		const layouts: Layout[] = [{ name: NAME, config: [] }];
		TestBed.configureTestingModule({
			providers: [
				provideRouter([]),
				{ provide: DialogRef, useValue: { close: () => undefined } },
				{
					provide: LayoutService,
					useValue: {
						getLayouts: () => layouts,
						getLayout: (name: string) => layouts.find((x) => x.name === name),
						saveLayout: () => undefined,
						deleteLayout: () => undefined,
					},
				},
			],
		});
	}

	/** The bold name in the open dialog, or in `root`. */
	function strong(root: ParentNode = document): HTMLElement | null {
		return root.querySelector('.cdk-overlay-container p strong, app-alert strong');
	}

	afterEach(() => document.querySelector('.cdk-overlay-container')?.replaceChildren());

	it('shows the name as plain text when confirming a delete', async () => {
		setup();
		const fixture = TestBed.createComponent(LoadLayoutComponent);
		fixture.detectChanges();
		fixture.componentInstance.deleteLayout({ name: NAME, modules: [] }, new Event('click'));
		await fixture.whenStable();
		const name = strong();
		expect(name?.textContent).toBe(NAME);
		expect(name?.children.length).toBe(0);
		expect(name?.parentElement?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
			`Are you sure you want to delete ${NAME}?`
		);
	});

	it('shows the name as plain text when confirming an overwrite', async () => {
		setup();
		const fixture = TestBed.createComponent(SaveLayoutComponent);
		fixture.componentInstance.model.set({ name: NAME });
		fixture.detectChanges();
		fixture.componentInstance.saveLayout();
		await fixture.whenStable();
		const name = strong();
		expect(name?.textContent).toBe(NAME);
		expect(name?.parentElement?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
			`${NAME} already exists. Confirm overwrite?`
		);
	});

	it('shows the name as plain text in the saved message', async () => {
		setup();
		const fixture = TestBed.createComponent(StationCalculatorComponent);
		fixture.detectChanges();
		fixture.componentInstance.layout.set({ name: NAME, config: [] });
		fixture.componentInstance.saveLayout();
		fixture.detectChanges();
		await fixture.whenStable();
		const element = fixture.nativeElement as HTMLElement;
		const name = strong(element);
		expect(name?.textContent).toBe(NAME);
		expect(name?.children.length).toBe(0);
		expect(element.querySelector('app-alert')?.textContent).toContain(`${NAME} successfully saved.`);
	});
});
