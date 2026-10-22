import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SaveMap, SaveOffer, SaveStation } from '../../savegame/map/save-map-model';
import { SavegameStore } from '../../savegame/savegame-store';
import { SupplyDemandDiagnosis } from '../supply-demand-diagnosis';
import { SupplyDemandStore } from '../supply-demand-store';
import SupplyDemandPageComponent from './supply-demand-page.component';

const ARGON_PRIME = 'cluster_14_sector001';
const SECOND_CONTACT = 'cluster_13_sector001';
/** two jumps from Argon Prime, through Second Contact */
const TRUE_SIGHT = 'cluster_12_sector001';

describe('SupplyDemandPageComponent', () => {
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

	const station = (code: string, sector: string, owner: string, modules: string[], offers: SaveOffer[] = []) =>
		({
			code,
			macro: 'station_gen_factory_01',
			owner,
			sector,
			x: 0,
			z: 0,
			known: true,
			modules,
			workforce: { argon: 90 },
			offers,
		}) satisfies SaveStation;
	const MAP: SaveMap = {
		sectors: [ARGON_PRIME, SECOND_CONTACT, TRUE_SIGHT].map((id) => ({
			id,
			owner: 'argon',
			contested: false,
			known: true,
		})),
		stations: [
			station(
				'PLANT',
				ARGON_PRIME,
				'argon',
				['prod_gen_energycells'],
				[
					{ ware: 'energycells', sell: true, price: 10, amount: 5000 },
					{ ware: 'ore', sell: true, price: 50, amount: 100 },
				]
			),
			station('SMELT', ARGON_PRIME, 'argon', ['prod_gen_refinedmetals']),
			station('HOME', SECOND_CONTACT, 'argon', ['hab_arg_m_01']),
			station('FAR', TRUE_SIGHT, 'teladi', ['prod_gen_energycells']),
			station('MINE', TRUE_SIGHT, 'player', ['prod_gen_energycells']),
		],
		playerShips: {},
	};

	async function setup(url = '/supply-demand', map: SaveMap | null = MAP) {
		const active = signal(
			map && { id: 'x', schemaVersion: 4, info: { saveName: 'Save 5', gameTime: 7380 }, data: { map } }
		);
		TestBed.configureTestingModule({
			providers: [
				provideRouter([{ path: 'supply-demand', component: SupplyDemandPageComponent }]),
				{
					provide: SavegameStore,
					useValue: { active, activeId: signal(map ? 'x' : null), status: () => 'ok' },
				},
			],
		});
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(url, SupplyDemandPageComponent);
		const settle = async () => {
			await harness.fixture.whenStable();
			TestBed.tick();
			await harness.fixture.whenStable();
			harness.detectChanges();
		};
		await settle();
		const element = harness.routeNativeElement!;
		const store = harness.routeDebugElement!.injector.get(SupplyDemandStore);
		const router = TestBed.inject(Router);
		const set = async (selector: string, value: string) => {
			const control = element.querySelector<HTMLInputElement | HTMLSelectElement>(selector)!;
			control.value = value;
			control.dispatchEvent(new Event('input'));
			control.dispatchEvent(new Event('change'));
			await settle();
		};
		const wares = () => store.rows().map((x) => x.ware);
		return { element, store, router, settle, set, wares };
	}

	it('shows the empty state without a save', async () => {
		const { element } = await setup('/supply-demand', null);
		expect(element.textContent).toContain('Load a savegame');
		expect(element.querySelector('a[href="/saves"]')).not.toBeNull();
	});

	it('shows the experimental pill and the capacity note', async () => {
		const { element } = await setup();
		expect(element.querySelector('.card-header span.rounded-full')!.textContent).toBe('Experimental');
		expect(element.textContent).toContain('Capacity at full input supply; market values as of save time (Save 5,');
	});

	it('lists the wares, the biggest shortfall first, without mined ones', async () => {
		const { element, store, wares } = await setup();
		expect(wares()).toContain('energycells');
		expect(wares()).not.toContain('ore');
		const values = store.rows().map((x) => x.value);
		expect(values).toEqual([...values].sort((a, b) => a - b));
		expect(element.querySelectorAll('app-data-grid tbody tr').length).toBe(store.rows().length);
		expect(element.querySelector('a[href="/wares/energycells"]')).not.toBeNull();
		expect(store.selected()).toBe(store.rows()[0]);
	});

	it('shows mined resources with a dash where mining is not counted', async () => {
		const { element, store, wares, router, settle } = await setup();
		element.querySelector<HTMLInputElement>('#supply-mined')!.click();
		await settle();
		expect(wares()).toContain('ore');
		expect(router.url).toBe('/supply-demand?mined=1');
		expect(store.rows().find((x) => x.ware === 'ore')).toMatchObject({ mined: true, marketBased: true });
		const row = [...element.querySelectorAll('app-data-grid tbody tr')].find((x) =>
			x.textContent!.includes('Ore')
		)!;
		expect([...row.querySelectorAll('td')].some((x) => x.textContent!.trim() === '—')).toBe(true);
	});

	it('picks the scope from a faction and a sector', async () => {
		const { store, set, router } = await setup();
		const producers = () => store.rows().find((x) => x.ware === 'energycells')!.producers;
		expect(producers()).toBe(3);
		await set('#supply-scope', 'faction');
		await set('#supply-faction', 'teladi');
		expect(producers()).toBe(1);
		expect(router.url).toBe('/supply-demand?scope=faction&faction=teladi');
		await set('#supply-scope', 'sector');
		await set('#supply-sector', 'Argon Prime');
		await set('#supply-jumps', '1');
		expect(store.centre()).toBe(ARGON_PRIME);
		expect(store.jumps()).toBe(1);
		// Argon Prime and Second Contact only
		expect(producers()).toBe(1);
		expect(router.url).toBe(`/supply-demand?scope=sector&sector=${ARGON_PRIME}&jumps=1`);
	});

	it('drops a faction from the URL that owns no station in the save', async () => {
		const { store, router } = await setup('/supply-demand?scope=faction&faction=xenon');
		expect(store.model().faction).toBe('');
		expect(router.url).toBe('/supply-demand');
	});

	it('keeps a faction from the URL that owns stations in the save', async () => {
		const { store } = await setup('/supply-demand?scope=faction&faction=teladi');
		expect(store.model().faction).toBe('teladi');
	});

	it('leaves the player stations out when asked', async () => {
		const { element, store, router, settle } = await setup();
		element.querySelector<HTMLInputElement>('#supply-player')!.click();
		await settle();
		expect(store.rows().find((x) => x.ware === 'energycells')!.producers).toBe(2);
		expect(router.url).toBe('/supply-demand?player=0');
	});

	it('sets the centre like a map click would', async () => {
		const { store, element, settle } = await setup();
		store.setCentre(SECOND_CONTACT);
		await settle();
		expect(store.centre()).toBe(SECOND_CONTACT);
		expect(element.querySelector<HTMLInputElement>('#supply-sector')!.value).toBe(store.sectorName(SECOND_CONTACT));
	});

	it('selects a ware with a row click and keeps it in ?ware=', async () => {
		const { element, store, router, settle } = await setup();
		const second = store.rows()[1];
		element.querySelectorAll('app-data-grid tbody tr')[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await settle();
		expect(store.selectedWare()).toBe(second.ware);
		expect(router.url).toBe(`/supply-demand?ware=${second.ware}`);
	});

	it('ignores unknown query values and follows URL changes it did not write', async () => {
		const { store, router, settle, wares } = await setup('/supply-demand?scope=x&group=x&ware=nope&sector=nope');
		expect(store.model()).toEqual(SupplyDemandStore.DEFAULTS);
		expect(store.selected()).toBe(store.rows()[0]);
		expect(router.url).not.toContain('nope');
		await router.navigateByUrl('/supply-demand?mined=1');
		await settle();
		expect(wares()).toContain('ore');
		await router.navigateByUrl('/supply-demand');
		await settle();
		expect(wares()).not.toContain('ore');
		expect(router.url).toBe('/supply-demand');
	});

	async function selectWare(ware: string) {
		const ctx = await setup();
		ctx.store.select(ctx.store.rows().find((x) => x.ware === ware)!);
		await ctx.settle();
		return ctx;
	}

	it('colours the map by the selected ware and sets the centre on a click', async () => {
		const { element, store, settle } = await selectWare('energycells');
		const hex = (id: string) => element.querySelector<SVGPolygonElement>(`polygon[data-sector="${id}"]`)!;
		// the power plant makes energy cells without a user nearby: a surplus (green)
		expect(hex(ARGON_PRIME).getAttribute('fill')).toMatch(/^hsl\(140,/);
		expect(element.querySelector('[data-centre]')).toBeNull();
		const area = element.querySelector('app-heat-map [role="region"]')!;
		for (const type of ['pointerdown', 'pointerup']) {
			hex(SECOND_CONTACT).dispatchEvent(new MouseEvent(type, { bubbles: true, button: 0 }));
		}
		await settle();
		expect(area).not.toBeNull();
		expect(store.centre()).toBe(SECOND_CONTACT);
		expect(element.querySelector('[data-centre]')!.getAttribute('data-centre')).toBe(SECOND_CONTACT);
	});

	it('notes that the map of a mined ware shows how much is used', async () => {
		const { element, store, settle } = await setup('/supply-demand?mined=1&ware=ore');
		expect(store.selectedWare()).toBe('ore');
		expect(element.querySelector('app-supply-demand-map')!.textContent).toContain('shows how much is used');
		store.select(store.rows().find((x) => x.ware === 'energycells')!);
		await settle();
		expect(element.querySelector('app-supply-demand-map')!.textContent).not.toContain('how much is used');
	});

	it('lists the top producers, the offers and a link to the ware in the detail panel', async () => {
		const { element } = await selectWare('energycells');
		const panel = element.querySelector('app-supply-demand-detail')!;
		const producers = panel.querySelectorAll('[data-producers] li');
		expect(producers.length).toBe(3);
		expect(producers[0].querySelector('a')!.getAttribute('href')).toContain('/sectors/');
		const sellers = panel.querySelectorAll('[data-sellers] li');
		expect(sellers.length).toBe(1);
		expect(sellers[0].textContent).toContain('5,000 at 10.00 Cr');
		expect(panel.querySelector('[data-buyers]')).toBeNull();
		expect(panel.querySelector('a[href="/wares/energycells"]')).not.toBeNull();
	});

	it('shows the net of each input in the scope of the centre', async () => {
		const { element, store, settle } = await selectWare('refinedmetals');
		store.setCentre(ARGON_PRIME);
		await settle();
		const inputs = [...element.querySelectorAll('app-supply-demand-detail [data-inputs] li')];
		const text = (ware: string) => inputs.find((x) => x.querySelector(`a[href="/wares/${ware}"]`))!.textContent;
		// energy cells: the plants make them, the smelter uses 90 per cycle; ore is mined, so no number
		expect(text('energycells')).toContain('Energy Cells');
		expect(text('ore')).toContain('—');
	});

	it('outlines the area of the centre on the map, dimming the other sectors', async () => {
		const { element, store, settle } = await setup(`/supply-demand?scope=sector&sector=${ARGON_PRIME}&jumps=1`);
		const hex = (id: string) => element.querySelector<SVGPolygonElement>(`polygon[data-sector="${id}"]`)!;
		// Argon Prime and its neighbour Second Contact, but not True Sight, two jumps away
		expect(hex(ARGON_PRIME).hasAttribute('data-area')).toBe(true);
		expect(hex(SECOND_CONTACT).hasAttribute('data-area')).toBe(true);
		expect(hex(TRUE_SIGHT).hasAttribute('data-area')).toBe(false);
		expect(hex(TRUE_SIGHT).hasAttribute('data-outside')).toBe(true);
		expect(hex(SECOND_CONTACT).querySelector('title')!.textContent).toContain(
			`in the area of ${store.sectorName(ARGON_PRIME)}`
		);
		expect(hex(TRUE_SIGHT).querySelector('title')!.textContent).not.toContain('in the area');
		store.model.update((x) => ({ ...x, scope: 'galaxy' }));
		await settle();
		expect(element.querySelector('[data-area]')).toBeNull();
		expect(element.querySelector('[data-outside]')).toBeNull();
	});

	it('colours each sector by its own stations in the local mode and by its reach in the reach mode', async () => {
		const { element, store, router, settle } = await selectWare('energycells');
		const hex = (id: string) => element.querySelector<SVGPolygonElement>(`polygon[data-sector="${id}"]`)!;
		const caption = () => element.querySelector('[data-caption]')!.textContent;
		expect(caption()).toContain('this sector');
		// Second Contact has no energy cell station of its own, only a habitat: local, it uses a little
		expect(hex(SECOND_CONTACT).querySelector('title')!.textContent).toMatch(
			/short · consumers: 1|nothing made|balanced/
		);
		const local = hex(SECOND_CONTACT).getAttribute('fill');
		element.querySelector<HTMLInputElement>('#supply-map-reach')!.click();
		await settle();
		expect(store.mapMode()).toBe('reach');
		expect(router.url).toContain('map=reach');
		expect(caption()).toContain('within 3 jumps');
		// within the jumps, the plant of Argon Prime reaches Second Contact
		expect(hex(SECOND_CONTACT).getAttribute('fill')).not.toBe(local);
		expect(hex(SECOND_CONTACT).querySelector('title')!.textContent).toMatch(
			/within 3 jumps .* surplus \(.*\) · mostly/
		);
		element.querySelector<HTMLInputElement>('#supply-map-local')!.click();
		await settle();
		expect(router.url).not.toContain('map=');
		expect(hex(SECOND_CONTACT).getAttribute('fill')).toBe(local);
	});

	it('groups the columns under two headers and shows the default ones', async () => {
		const { element } = await setup();
		const groups = [...element.querySelectorAll('app-data-grid tr.grid-groups th')].map((x) =>
			x.firstChild!.textContent!.trim()
		);
		expect(groups).toEqual(['', 'Built capacity / h', 'Diagnosis (capacity × market)', 'Market now']);
		const captions = [...element.querySelectorAll('app-data-grid thead tr:nth-child(2) th')].map((x) =>
			x.textContent!.trim()
		);
		expect(captions).toEqual([
			'Ware',
			'Produced/h',
			'Consumed/h',
			'Net/h',
			'Balance',
			'Value/h',
			'Diagnosis',
			'Stock offered',
			'Wanted',
		]);
	});

	it('shows the diagnosis of a ware with a dot, its meaning in the title, and the balance as a bar', async () => {
		const { element, store, settle } = await setup();
		const chooser = element.querySelector<HTMLButtonElement>('app-data-grid button[aria-expanded]')!;
		chooser.click();
		await settle();
		for (const box of element.querySelectorAll<HTMLInputElement>('app-data-grid input[type=checkbox]')) {
			if (!box.checked) {
				box.click();
			}
		}
		await settle();
		const index = store.rows().findIndex((x) => x.ware === 'energycells');
		const row = store.rows()[index];
		const cells = [...element.querySelectorAll('app-data-grid tbody tr')[index].querySelectorAll('td')];
		const diagnosis = cells.find((x) => x.querySelector('app-tone-dot'))!;
		expect(diagnosis.textContent).toContain(SupplyDemandDiagnosis.KINDS[row.diagnosis.kind]);
		expect(diagnosis.querySelector('app-tone-dot')).not.toBeNull();
		expect(diagnosis.getAttribute('title')).toBeTruthy();
		expect(cells.some((x) => x.querySelector('.grid-bar') && /%\*?$/.test(x.textContent!))).toBe(true);
	});

	it('repeats the diagnosis in the detail panel header', async () => {
		const { element, store } = await setup();
		const line = element.querySelector('[data-diagnosis]')!.textContent!;
		expect(line).toContain(SupplyDemandDiagnosis.label(store.selected()!.diagnosis));
		expect(line).toContain('Cr/h');
	});

	it('remembers that the note on how to read the table was closed', async () => {
		const first = await setup();
		expect(first.element.querySelector('#supply-demand-help')).not.toBeNull();
		first.element.querySelector<HTMLButtonElement>('button[aria-controls="supply-demand-help"]')!.click();
		await first.settle();
		expect(first.element.querySelector('#supply-demand-help')).toBeNull();
		expect(localStorage.getItem('supply-demand-help-open')).toBe('false');
	});

	it('enables the jumps for a sector scope or the Reach map, and says what they affect', async () => {
		const { element, store, router, set, settle } = await setup();
		const jumps = () => element.querySelector<HTMLInputElement>('#supply-jumps')!;
		const hint = () => jumps().closest('label')!.getAttribute('title');
		expect(jumps().disabled).toBe(true);

		element.querySelector<HTMLInputElement>('#supply-map-reach')!.click();
		await settle();
		expect(jumps().disabled).toBe(false);
		expect(hint()).toBe('Reach of the map');
		await set('#supply-jumps', '2');
		expect(store.jumps()).toBe(2);
		expect(router.url).toContain('jumps=2');

		await set('#supply-scope', 'sector');
		expect(jumps().disabled).toBe(false);
		expect(hint()).toBe('Area around the sector and reach of the map');

		element.querySelector<HTMLInputElement>('#supply-map-local')!.click();
		await settle();
		expect(jumps().disabled).toBe(false);
		expect(hint()).toBe('Area around the sector');

		await set('#supply-scope', 'galaxy');
		expect(jumps().disabled).toBe(true);
	});
});
