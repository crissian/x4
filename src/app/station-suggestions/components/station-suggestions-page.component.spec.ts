import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SaveMap, SaveStation } from '../../savegame/map/save-map-model';
import { SavegameStore } from '../../savegame/savegame-store';
import StationCalculatorComponent from '../../station/components/station-calculator.component';
import { StationSuggestionsStore } from '../station-suggestions-store';
import StationSuggestionsPageComponent from './station-suggestions-page.component';

const ARGON_PRIME = 'cluster_14_sector001';
const SECOND_CONTACT = 'cluster_13_sector001';

describe('StationSuggestionsPageComponent', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.stubGlobal(
			'ResizeObserver',
			class {
				observe = vi.fn();
				disconnect = vi.fn();
			}
		);
	});
	afterEach(() => vi.unstubAllGlobals());

	const station = (code: string, sector: string, modules: string[], counts: number[]) =>
		({
			code,
			macro: 'station_gen_factory_01',
			owner: 'argon',
			sector,
			x: 0,
			z: 0,
			known: true,
			modules,
			moduleCounts: counts,
		}) satisfies SaveStation;
	const MAP: SaveMap = {
		sectors: [ARGON_PRIME, SECOND_CONTACT].map((id) => ({ id, owner: 'argon', contested: false, known: true })),
		stations: [station('HULL', ARGON_PRIME, ['prod_gen_hullparts'], [400])],
		playerShips: {},
	};

	async function setup(url = '/station-suggestions', map: SaveMap | null = MAP) {
		const active = signal(
			map && { id: 'x', schemaVersion: 4, info: { saveName: 'Save 5', gameTime: 7380 }, data: { map } }
		);
		TestBed.configureTestingModule({
			providers: [
				provideRouter([{ path: 'station-suggestions', component: StationSuggestionsPageComponent }]),
				{
					provide: SavegameStore,
					useValue: { active, activeId: signal(map ? 'x' : null), status: () => 'ok' },
				},
			],
		});
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(url, StationSuggestionsPageComponent);
		const settle = async () => {
			await harness.fixture.whenStable();
			TestBed.tick();
			await harness.fixture.whenStable();
			harness.detectChanges();
		};
		await settle();
		const element = harness.routeNativeElement!;
		const store = harness.routeDebugElement!.injector.get(StationSuggestionsStore);
		return { element, store, settle, router: TestBed.inject(Router) };
	}

	it('explains the page without a save', async () => {
		const { element } = await setup('/station-suggestions', null);
		expect(element.querySelector('a[href="/saves"]')).not.toBeNull();
	});

	it('lists where to build, with the ware, sector, Cr/h and room shown', async () => {
		const { element, store } = await setup();
		const rows = store.rows();
		expect(rows.map((x) => x.ware)).toContain('energycells');
		expect(rows[0].sector).toBe(ARGON_PRIME);
		const headers = [...element.querySelectorAll('th')].map((x) => x.textContent?.trim() ?? '');
		expect(headers.some((x) => x.includes('Expected Cr/h'))).toBe(true);
		expect(headers.some((x) => x.includes('Room for modules'))).toBe(true);
		expect(headers.some((x) => x.includes('Absorbable'))).toBe(false);
		expect(element.querySelector('[data-detail]')?.textContent).toContain('Cr/h');
	});

	it('keeps the filters and the pick in the URL', async () => {
		const { store, settle, router } = await setup('/station-suggestions?ware=energycells&jumps=2');
		expect(store.model().ware).toBe('energycells');
		expect(store.options().jumps).toBe(2);
		expect(store.rows().every((x) => x.ware === 'energycells')).toBe(true);
		store.select(store.rows()[0]);
		await settle();
		expect(router.url).toContain(`pick=energycells~${ARGON_PRIME}`);
	});

	it('ranks the wares of a sector picked on the map', async () => {
		const { store, settle, router } = await setup();
		store.showSector(SECOND_CONTACT);
		await settle();
		expect(store.here()).toBe(true);
		expect(router.url).toContain(`sector=${SECOND_CONTACT}`);
		expect(router.url).toContain('mode=here');
		expect(store.rows().every((x) => x.sector === SECOND_CONTACT)).toBe(true);
	});

	it('asks for a sector in what to build here', async () => {
		const { element } = await setup('/station-suggestions?mode=here');
		expect(element.querySelector('[data-pick-sector]')).not.toBeNull();
	});

	it('shows the closed-loop station of the pick by default, with a calculator link', async () => {
		const { element, store } = await setup();
		expect(store.closed()).toBe(true);
		const chain = store.chain()!;
		expect(chain.modules[0].count).toBe(store.selected()!.modules);
		expect(element.querySelectorAll('[data-chain-modules] li').length).toBe(chain.modules.length);
		const link = element.querySelector<HTMLAnchorElement>('[data-calculator]')!;
		const l = new URL(link.href).searchParams.get('l')!;
		const rows = StationCalculatorComponent.parseSharedLayout(l);
		expect(rows).toEqual(chain.modules);
		expect(element.querySelectorAll('[data-marker]').length).toBeGreaterThan(0);
	});

	it('ranks by Cr/h when buying inputs', async () => {
		const { store, element } = await setup('/station-suggestions?loop=open');
		expect(store.closed()).toBe(false);
		const values = store.rows().map((x) => x.crPerHour);
		expect(values).toEqual([...values].sort((a, b) => b - a));
		expect(element.querySelector('[data-chain]')).toBeNull();
	});
});
