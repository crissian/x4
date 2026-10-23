import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AchievementsStore } from '../achievements-store';
import AchievementsPageComponent from './achievements-page.component';

describe('AchievementsPageComponent', () => {
	beforeEach(() => localStorage.clear());

	async function setup(url = '/achievements') {
		TestBed.configureTestingModule({
			providers: [provideRouter([{ path: 'achievements', component: AchievementsPageComponent }])],
		});
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(url);
		const settle = async () => {
			await harness.fixture.whenStable();
			TestBed.tick();
			await harness.fixture.whenStable();
			harness.detectChanges();
		};
		await settle();
		const store = harness.routeDebugElement!.injector.get(AchievementsStore);
		return { element: harness.routeNativeElement!, store, settle };
	}

	it('lists the achievements by DLC with story spoilers hidden', async () => {
		const { element, store } = await setup();
		expect(element.querySelectorAll('li input[type=checkbox]').length).toBe(store.rows.length);
		expect(element.textContent).toContain('BUILD_MODULES');
		expect(element.textContent).toContain('Story spoiler hidden');
		expect(element.textContent).not.toContain('Bestowed in Perpetuity');
	});

	it('shows the spoilers when asked in the URL', async () => {
		const { element } = await setup('/achievements?spoilers=1&dlc=3');
		expect(element.textContent).toContain('Bestowed in Perpetuity');
		expect(element.textContent).not.toContain('BUILD_MODULES');
	});

	it('keeps the done marks in local storage', async () => {
		const { element, store, settle } = await setup();
		const box = element.querySelector<HTMLInputElement>('#achievement-BUILD_MODULES')!;
		box.click();
		await settle();
		expect(store.done()['BUILD_MODULES']).toBe(true);
		expect(store.doneCount()).toBe(1);
		expect(JSON.parse(localStorage.getItem('achievements-done')!)).toEqual(['BUILD_MODULES']);
	});
});
