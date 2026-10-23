import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LazyValue } from '../../core/lazy-value';
import { RouteMapComponent } from '../../map/route-map/route-map.component';
import type { SaveMap, SaveOffer, SaveRelations, SaveShips, SaveStation } from '../../savegame/map/save-map-model';
import { SavegameStore } from '../../savegame/savegame-store';
import { TradeRouteFinder } from '../trade-route-finder';
import { TradeRoutesStore } from '../trade-routes-store';
import TradeRoutesPageComponent from './trade-routes-page.component';

const ARGON_PRIME = 'cluster_14_sector001';
const SECOND_CONTACT = 'cluster_13_sector001';
/** two jumps from Argon Prime, through Second Contact */
const TRUE_SIGHT = 'cluster_12_sector001';

describe('TradeRoutesPageComponent', () => {
	beforeEach(() => localStorage.clear());

	const station = (code: string, sector: string, offers: SaveOffer[]): SaveStation => ({
		code,
		macro: 'station_gen_factory_01',
		owner: 'argon',
		sector,
		x: 0,
		z: 0,
		known: true,
		modules: [],
		offers,
	});
	const STATIONS = [
		station('SEL-1', ARGON_PRIME, [{ ware: 'energycells', sell: true, price: 10, amount: 5000 }]),
		station('BUY-1', SECOND_CONTACT, [{ ware: 'energycells', sell: false, price: 20, amount: 5000 }]),
		station('SEL-2', TRUE_SIGHT, [{ ware: 'foodrations', sell: true, price: 5, amount: 5000 }]),
		station('BUY-2', ARGON_PRIME, [{ ware: 'foodrations', sell: false, price: 100, amount: 5000 }]),
	];
	const MAP: SaveMap = {
		sectors: [ARGON_PRIME, SECOND_CONTACT, TRUE_SIGHT].map((id) => ({
			id,
			owner: 'argon',
			contested: false,
			known: true,
		})),
		stations: STATIONS,
		playerShips: {},
	};

	async function setup(
		url = '/trade-routes',
		data: { map?: SaveMap; relations?: SaveRelations; ships?: SaveShips } | null = { map: MAP, relations: {} }
	) {
		const active = signal(
			data && { id: 'x', schemaVersion: 4, info: { saveName: 'Save 5', gameTime: 7380 }, data }
		);
		TestBed.configureTestingModule({
			providers: [
				provideRouter([{ path: 'trade-routes', component: TradeRoutesPageComponent }]),
				{
					provide: SavegameStore,
					useValue: { active, activeId: signal(data ? 'x' : null), status: () => 'ok' },
				},
			],
		});
		const harness = await RouterTestingHarness.create();
		const component = await harness.navigateByUrl(url, TradeRoutesPageComponent);
		const settle = async () => {
			await harness.fixture.whenStable();
			TestBed.tick();
			await LazyValue.settled();
			await harness.fixture.whenStable();
			harness.detectChanges();
		};
		await settle();
		const element = harness.routeNativeElement!;
		const store = harness.routeDebugElement!.injector.get(TradeRoutesStore);
		const router = TestBed.inject(Router);
		const set = async (selector: string, value: string) => {
			const control = element.querySelector<HTMLInputElement | HTMLSelectElement>(selector)!;
			control.value = value;
			control.dispatchEvent(new Event('input'));
			control.dispatchEvent(new Event('change'));
			await settle();
		};
		return { harness, component, element, store, router, settle, set };
	}

	it('shows the empty state without a save', async () => {
		const { element } = await setup('/trade-routes', null);
		expect(element.textContent).toContain('Load a savegame');
		expect(element.querySelector('a[href="/saves"]')).not.toBeNull();
	});

	it('lists routes sorted by profit per minute', async () => {
		const { element, store } = await setup();
		const routes = store.result().routes;
		expect(routes.map((x) => x.key)).toEqual(['SEL-2~BUY-2~foodrations', 'SEL-1~BUY-1~energycells']);
		const rows = element.querySelectorAll('tbody tr');
		expect(rows.length).toBe(2);
		expect(rows[0].textContent).toContain('Food Rations');
		expect(rows[1].textContent).toContain('Energy Cells');
		expect(element.querySelector('a[href="/wares/foodrations"]')).not.toBeNull();
	});

	it('reads filters from the URL', async () => {
		const { element, store } = await setup(`/trade-routes?ware=energycells&near=${ARGON_PRIME}&jumps=1`);
		expect(element.querySelector<HTMLSelectElement>('#trade-ware')!.value).toBe('energycells');
		expect(element.querySelector<HTMLInputElement>('#trade-near')!.value).toBe('Argon Prime');
		expect(element.querySelector<HTMLInputElement>('#trade-jumps')!.value).toBe('1');
		expect(store.result().routes.map((x) => x.key)).toEqual(['SEL-1~BUY-1~energycells']);
		// the empty leg column only shows with a near sector
		expect(element.querySelector('thead')!.textContent).toContain('To start');
	});

	it('writes filters to the URL', async () => {
		const { router, set, element, settle } = await setup();
		expect(element.querySelector('thead')!.textContent).not.toContain('To start');
		await set('#trade-ware', 'foodrations');
		expect(router.url).toBe('/trade-routes?ware=foodrations');

		await set('#trade-near', 'Argon Prime');
		// the empty leg column shows once a near sector is picked, though the first visit saved the columns without it
		expect(element.querySelector('thead')!.textContent).toContain('To start');
		element.querySelector<HTMLInputElement>('#trade-hostile')!.click();
		await settle();
		await set('#trade-ware', '');
		expect(router.url).toBe(`/trade-routes?near=${ARGON_PRIME}&hostile=1`);
	});

	it('selecting a row sets ?route= and passes the path to the route map', async () => {
		const { element, router, harness, settle, store } = await setup();
		const map = () =>
			harness.routeDebugElement!.query(By.directive(RouteMapComponent)).componentInstance as RouteMapComponent;
		// the first row is selected by default
		expect(store.selected()?.route.key).toBe('SEL-2~BUY-2~foodrations');
		expect(map().path()).toEqual([TRUE_SIGHT, SECOND_CONTACT, ARGON_PRIME]);

		element.querySelectorAll('tbody tr')[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await settle();
		expect(router.url).toBe('/trade-routes?route=SEL-1~BUY-1~energycells');
		expect(map().path()).toEqual([ARGON_PRIME, SECOND_CONTACT]);
		expect(element.querySelectorAll('tbody tr')[1].getAttribute('aria-current')).toBe('true');
	});

	it('ignores unknown query values', async () => {
		const { store, router } = await setup('/trade-routes?ship=nope&near=nope&ware=nope&route=a~b~c');
		expect(store.model()).toEqual(TradeRoutesStore.DEFAULTS);
		expect(store.result().routes.length).toBe(2);
		expect(store.selected()?.route.key).toBe('SEL-2~BUY-2~foodrations');
		expect(router.url).not.toContain('nope');
	});

	it('shows the reload note when the save has no relations', async () => {
		const { element } = await setup('/trade-routes', { map: MAP });
		expect(element.textContent).toContain('Reload this save');
		expect(element.querySelectorAll('tbody tr').length).toBe(2);
	});

	it('shows the price note', async () => {
		const { element } = await setup();
		expect(element.textContent).toContain('Prices as of save time (Save 5, 2h 3m)');
	});

	it('does not search again while typing text that matches no sector', async () => {
		const { set, router, store } = await setup();
		const find = vi.spyOn(TradeRouteFinder, 'find');
		const url = router.url;
		await set('#trade-near', 'Arg');
		await set('#trade-near', 'Argo');
		expect(store.model().near).toBe('Argo');
		expect(find).not.toHaveBeenCalled();
		expect(router.url).toBe(url);
		await set('#trade-near', 'Argon Prime');
		expect(find).toHaveBeenCalledTimes(1);
		find.mockRestore();
	});

	it('follows URL changes it did not write, such as the header link clearing the params', async () => {
		const { element, router, store, settle } = await setup(
			`/trade-routes?ware=energycells&route=SEL-1~BUY-1~energycells`
		);
		expect(element.querySelector<HTMLSelectElement>('#trade-ware')!.value).toBe('energycells');
		await router.navigateByUrl('/trade-routes');
		await settle();
		expect(store.model()).toEqual(TradeRoutesStore.DEFAULTS);
		expect(element.querySelector<HTMLSelectElement>('#trade-ware')!.value).toBe('');
		expect(element.querySelectorAll('tbody tr').length).toBe(2);
		expect(router.url).toBe('/trade-routes');

		await router.navigateByUrl(`/trade-routes?ware=foodrations`);
		await settle();
		expect(element.querySelector<HTMLSelectElement>('#trade-ware')!.value).toBe('foodrations');
		expect(router.url).toBe('/trade-routes?ware=foodrations');
	});

	describe('own ships', () => {
		const SHIPS: SaveShips = [
			{
				id: '[0x1]',
				code: 'ABC-001',
				macro: 'ship_arg_m_trans_container_02_a',
				sector: ARGON_PRIME,
				name: 'Mule',
				engine: 'engine_arg_m_combat_01_mk2',
				engines: 1,
			},
		];
		const data = { map: MAP, relations: {}, ships: SHIPS };

		it('offers the ships of the save and times routes with their engines', async () => {
			const { element, store, router, set } = await setup('/trade-routes', data);
			const group = element.querySelector('#trade-ship optgroup')!;
			expect(group.getAttribute('label')).toBe('Your ships');
			expect(group.textContent).toContain('Mule');
			expect(group.textContent).toContain('Argon Prime');
			await set('#trade-ship', 'own-0x1');
			expect(router.url).toBe('/trade-routes?ship=own-0x1');
			expect(element.querySelector('#trade-cargo')).toBeNull();
			const own = store.ownShips()[0];
			expect(store.ship().speed).toBe(own.travel!.speed);
			expect(store.ship().capacity['container']).toBe(own.capacity);
		});

		it('reads an own ship from the URL once the save has loaded', async () => {
			const { element, store } = await setup('/trade-routes?ship=own-0x1', data);
			expect(store.custom()).toBe(false);
			expect(element.querySelector<HTMLSelectElement>('#trade-ship')!.value).toBe('own-0x1');
		});

		it('falls back to the custom ship for a ship not in the save', async () => {
			const { element, store } = await setup('/trade-routes?ship=own-0x9', data);
			expect(store.custom()).toBe(true);
			expect(element.querySelector('#trade-cargo')).not.toBeNull();
		});

		it('offers no own ships for a save read before they were', async () => {
			const { element } = await setup();
			expect(element.querySelector('#trade-ship')!.textContent).not.toContain('Your ships');
		});
	});

	describe('best sell per buy station', () => {
		const twoBuyers: SaveMap = {
			...MAP,
			stations: [
				...STATIONS,
				station('BUY-3', ARGON_PRIME, [{ ware: 'energycells', sell: false, price: 15, amount: 5000 }]),
			],
		};

		it('keeps the best buyer per offer until unticked', async () => {
			const { element, store, router, settle } = await setup('/trade-routes', { map: twoBuyers, relations: {} });
			expect(store.result().routes.filter((x) => x.seller.code === 'SEL-1').length).toBe(1);
			expect(element.querySelector('tbody')!.textContent).toContain('+1 buyers');
			element.querySelector<HTMLInputElement>('#trade-best')!.click();
			await settle();
			expect(router.url).toBe('/trade-routes?best=0');
			expect(store.result().routes.filter((x) => x.seller.code === 'SEL-1').length).toBe(2);
		});
	});

	describe('illegal wares', () => {
		const fuel: SaveMap = {
			// spacefuel is illegal for the Argon, whose sector is only passed through
			sectors: [ARGON_PRIME, SECOND_CONTACT, TRUE_SIGHT].map((id) => ({
				id,
				owner: id === SECOND_CONTACT ? 'argon' : 'teladi',
				contested: false,
				known: true,
			})),
			stations: [
				station('SEL-F', ARGON_PRIME, [{ ware: 'spacefuel', sell: true, price: 10, amount: 5000 }]),
				station('BUY-F', TRUE_SIGHT, [{ ware: 'spacefuel', sell: false, price: 30, amount: 5000 }]),
			],
			playerShips: {},
		};

		it('marks the route and warns on the map and in the details', async () => {
			const { element, store, harness } = await setup('/trade-routes', { map: fuel, relations: {} });
			expect(store.result().routes[0].illegalSectors).toEqual([SECOND_CONTACT]);
			expect(element.querySelector('tbody tr')!.textContent).toContain('illegal (1)');
			expect(element.querySelector('section p.text-danger')!.textContent).toContain('is illegal in:');
			expect(element.querySelector('section p.text-danger a[href="/sectors/' + SECOND_CONTACT + '"]')).not.toBeNull();
			const map = harness.routeDebugElement!.query(By.directive(RouteMapComponent)).componentInstance;
			expect((map as RouteMapComponent).warnSectors()).toEqual([SECOND_CONTACT]);
		});

		it('hides the routes and round-trips ?illegal=hide', async () => {
			const { element, store, router, set } = await setup('/trade-routes?illegal=hide', {
				map: fuel,
				relations: {},
			});
			expect(element.querySelector<HTMLSelectElement>('#trade-illegal')!.value).toBe('hide');
			expect(store.result().routes).toEqual([]);
			await set('#trade-illegal', 'show');
			expect(router.url).toBe('/trade-routes');
			expect(store.result().routes.length).toBe(1);
			await set('#trade-illegal', 'hide');
			expect(router.url).toBe('/trade-routes?illegal=hide');
			expect(store.result().total).toBe(0);
		});
	});
});
