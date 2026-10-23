import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { SaveBlueprints, SaveLicences, SaveRelations } from '../../savegame/map/save-map-model';
import { SavegameStore } from '../../savegame/savegame-store';
import { BlueprintsStore } from '../blueprints-store';
import BlueprintsPageComponent from './blueprints-page.component';

/** Argon and Antigone sell it with their basic module licence. */
const CONNECTION = 'module_arg_conn_base_01';

describe('BlueprintsPageComponent', () => {
	beforeEach(() => localStorage.clear());

	async function setup(
		url = '/blueprints',
		data: { blueprints?: SaveBlueprints; licences?: SaveLicences; relations?: SaveRelations } | null = {
			blueprints: ['module_arg_conn_arc_01', 'paintmod_0001'],
			licences: { station_gen_basic: ['argon'] },
			relations: { argon: 0.01 },
		},
		status = 'ok'
	) {
		const active = signal(
			data && {
				id: 'x',
				schemaVersion: 5,
				info: { saveName: 'Save 5', gameTime: 7380, money: 1234567 },
				data,
			}
		);
		TestBed.configureTestingModule({
			providers: [
				provideRouter([{ path: 'blueprints', component: BlueprintsPageComponent }]),
				{
					provide: SavegameStore,
					useValue: { active, activeId: signal(data ? 'x' : null), status: () => status },
				},
			],
		});
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(url, BlueprintsPageComponent);
		const settle = async () => {
			await harness.fixture.whenStable();
			TestBed.tick();
			await harness.fixture.whenStable();
			harness.detectChanges();
		};
		await settle();
		const element = harness.routeNativeElement!;
		const store = harness.routeDebugElement!.injector.get(BlueprintsStore);
		const router = TestBed.inject(Router);
		const set = async (selector: string, value: string) => {
			const control = element.querySelector<HTMLInputElement | HTMLSelectElement>(selector)!;
			control.value = value;
			control.dispatchEvent(new Event('input'));
			control.dispatchEvent(new Event('change'));
			await settle();
		};
		return { element, store, router, settle, set };
	}

	it('explains the page without a save', async () => {
		const { element } = await setup('/blueprints', null);
		expect(element.textContent).toContain('Load a savegame');
		expect(element.querySelector('a[href="/saves"]')).not.toBeNull();
	});

	it('asks to reload a save read before blueprints were', async () => {
		const { element, store } = await setup('/blueprints', { relations: {} }, 'reload-needed');
		expect(store.status()).toBe('reload-needed');
		expect(element.textContent).toContain('Reload this save to read its blueprints');
	});

	it('shows the progress per category and the untracked blueprints', async () => {
		const { element, store } = await setup();
		expect(store.status()).toBe('ready');
		expect(element.textContent).toContain(`You own 1 of ${store.catalog.length} blueprints.`);
		expect(element.textContent).toContain('Plus 1 other blueprints in your save');
		expect(element.textContent).toContain('as of save time (Save 5, 2h 3m)');
		const connections = store.categories().find((x) => x.category.id === 'module-connection')!;
		expect(connections.owned).toBe(1);
		expect(element.querySelectorAll('[role=progressbar]').length).toBe(store.categories().length);
	});

	it('lists what the licences in the save let the player buy, one row per blueprint with its sellers', async () => {
		const { element, store } = await setup('/blueprints?tab=shopping');
		const buy = store.filtered().buy;
		const connection = buy.find((x) => x.item.id === CONNECTION)!;
		// the Antigone licence isn't held
		expect(connection.sellers.map((x) => x.faction.id)).toEqual(['argon']);
		expect(new Set(buy.map((x) => x.item.id)).size).toBe(buy.length);
		// Kaori sells no blueprints
		expect(buy.some((x) => x.sellers.some((s) => s.faction.id === 'kaori'))).toBe(false);
		expect(element.textContent).toContain('Money in save: 1,234,567 Cr');
		expect(element.textContent).toContain('Need more reputation');
		expect(element.querySelector('#blueprint-faction')).not.toBeNull();
	});

	it('narrows the shopping list to a faction and to what the money pays for, kept in the URL', async () => {
		const { element, router, set, settle, store } = await setup('/blueprints?tab=shopping&category=module');
		expect(store.filtered().buy.every((x) => x.item.kind === 'module')).toBe(true);
		const argon = store.factionTotals().find((x) => x.faction.id === 'argon')!;
		expect(argon.count).toBe(store.filtered().buy.length);
		await set('#blueprint-faction', 'argon');
		expect(store.summary()).toEqual({ count: argon.count, total: argon.total });
		const affordable = element.querySelector<HTMLInputElement>('#blueprint-affordable')!;
		affordable.click();
		await settle();
		expect(store.model().affordable).toBe(true);
		expect(store.filtered().buy.every((x) => x.item.price <= 1234567)).toBe(true);
		expect(router.url).toBe('/blueprints?tab=shopping&category=module&faction=argon&afford=1');
	});

	it('shows the shopping list section the URL names, as a sub-tab', async () => {
		const { element, router, settle, store } = await setup('/blueprints?tab=shopping&list=unsold');
		expect(store.section()).toBe('unsold');
		expect(element.textContent).toContain('No faction representative sells these.');
		expect(element.querySelector('#blueprint-faction')).toBeNull();
		store.section.set('buy');
		await settle();
		expect(router.url).toBe('/blueprints?tab=shopping');
	});

	it('reads the filters from the URL', async () => {
		const { element, store } = await setup('/blueprints?category=module-connection&q=ARC&complete=hide');
		expect(element.querySelector<HTMLSelectElement>('#blueprint-category')!.value).toBe('module-connection');
		expect(element.querySelector<HTMLInputElement>('#blueprint-search')!.value).toBe('ARC');
		expect(element.querySelector<HTMLInputElement>('#blueprint-complete')!.checked).toBe(true);
		const categories = store.categories();
		expect(categories.map((x) => x.category.id)).toEqual(['module-connection']);
		expect(categories[0].missing.every((x) => x.name.toLowerCase().includes('arc'))).toBe(true);
	});

	it('writes the filters and the tab to the URL, ignoring unknown values', async () => {
		const { router, set, store, settle } = await setup('/blueprints?category=nope');
		expect(store.model().category).toBe('');
		expect(router.url).toBe('/blueprints');
		await set('#blueprint-category', 'equipment-weapons');
		await set('#blueprint-search', 'pulse');
		expect(router.url).toBe('/blueprints?category=equipment-weapons&q=pulse');
		store.tab.set('shopping');
		await settle();
		expect(router.url).toBe('/blueprints?category=equipment-weapons&q=pulse&tab=shopping');
		expect(store.filtered().buy.every((x) => x.item.category === 'equipment-weapons')).toBe(true);
	});
});
