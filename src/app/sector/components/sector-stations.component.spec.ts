import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LazyValue } from '../../core/lazy-value';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import type { SaveStation } from '../../savegame/map/save-map-model';
import { SavegameStore } from '../../savegame/savegame-store';
import { SectorStationsComponent } from './sector-stations.component';

const ARGON_PRIME = 'cluster_14_sector001';

describe('SectorStationsComponent', () => {
	async function setup(stations?: SaveStation[]) {
		const data = stations ? { map: { sectors: [], stations, playerShips: {} } } : {};
		const active = signal(stations ? { id: 'x', data } : null);
		TestBed.configureTestingModule({
			providers: [provideRouter([]), { provide: SavegameStore, useValue: { active } }],
		});
		const fixture = TestBed.createComponent(SectorStationsComponent);
		fixture.componentRef.setInput('sector', ARGON_PRIME);
		await fixture.whenStable();
		TestBed.tick();
		await LazyValue.settled();
		fixture.detectChanges();
		return { fixture, component: fixture.componentInstance, element: fixture.nativeElement as HTMLElement };
	}

	function station(extra: Partial<SaveStation>): SaveStation {
		return {
			code: 'ABC-123',
			macro: 'station_gen_factory_01',
			owner: 'argon',
			sector: ARGON_PRIME,
			x: 0,
			z: 0,
			known: true,
			modules: [],
			...extra,
		};
	}

	it('lists the game start stations without a save', async () => {
		const { component, element } = await setup();
		expect(component.fromSave()).toBe(false);
		const argon = component.groups()!.find((x) => x.owner === 'argon')!;
		expect(argon.stations.map((x) => x.type.id)).toContain('shipyard');
		expect(element.querySelector('a[href="/factions/argon"]')).not.toBeNull();
		expect(element.querySelector('a[href="/map?sector=cluster_14_sector001"]')).not.toBeNull();
	});

	it('lists the save stations of the sector, the player first, marking own stations and wrecks', async () => {
		const { component, element } = await setup([
			station({ code: 'NPC-1', basename: '{20102,1131}', modules: ['buildmodule_arg_ships_l'] }),
			station({ code: 'MINE-1', owner: 'player', name: 'My Dock' }),
			station({ code: 'WRK-1', owner: 'xenon', state: 'wreck' }),
			station({ code: 'ELSE-1', sector: 'cluster_01_sector001' }),
		]);
		expect(component.fromSave()).toBe(true);
		const groups = component.groups()!;
		expect(groups.map((x) => x.owner)).toEqual(['player', 'argon', 'xenon']);
		expect(groups[0].stations[0]).toMatchObject({ name: 'My Dock', player: true });
		expect(groups[1].stations[0]).toMatchObject({ name: 'ARG Argon Shipyard' });
		expect(groups[1].stations[0].type.id).toBe('shipyard');
		expect(groups[2].stations[0]).toMatchObject({ wreck: true });
		expect(element.textContent).toContain('Yours');
		expect(element.textContent).toContain('Wreck');
	});

	it('heads the player group "Your stations" without a faction link and puts it first', async () => {
		const { component, element } = await setup([
			station({ code: 'NPC-1' }),
			station({ code: 'MINE-1', owner: 'player', name: 'My Dock' }),
			station({ code: 'MINE-2', owner: 'player', name: 'My Wharf' }),
		]);
		const groups = component.groups()!;
		expect(groups[0]).toMatchObject({ owner: 'player', faction: undefined });
		const heading = element.querySelector('h6')!;
		expect(heading.textContent).toContain('Your stations');
		expect(heading.querySelector('span')?.textContent).toBe('2');
		expect(element.querySelector('a[href="/factions/player"]')).toBeNull();
		expect(element.querySelector('a[href="/factions/argon"]')).not.toBeNull();
	});

	const traded = (code: string, extra: Partial<SaveStation> = {}) =>
		station({
			code,
			modules: ['prod_gen_energycells', 'unknown_module'],
			moduleCounts: [3, 1],
			offers: [
				{ ware: 'energycells', sell: true, price: 16.5, amount: 1200 },
				{ ware: 'spaceweed', sell: false, price: 274.92, amount: 227, playerOnly: true },
			],
			workforce: { argon: 76 },
			...extra,
		});

	it('selects the first station by default and shows its offers, modules and workforce', async () => {
		const { fixture, component, element } = await setup([
			traded('AAA-1', { name: 'Alpha' }),
			station({ code: 'BBB-2', name: 'Beta' }),
		]);
		expect(component.current()?.id).toBe('AAA-1');
		const rows = [...element.querySelectorAll<HTMLButtonElement>('li button')];
		expect(rows.map((x) => x.getAttribute('aria-current'))).toEqual(['true', null]);
		expect(rows.map((x) => x.tabIndex)).toEqual([0, -1]);

		const panel = element.querySelector('app-sector-station-details')!;
		expect(panel.textContent).toContain('Alpha');
		expect(panel.textContent).toContain('AAA-1');
		expect(panel.querySelector('table a[href="/wares/energycells"]')).not.toBeNull();
		expect(panel.textContent).toContain('16.50');
		expect(panel.textContent).toContain('76');

		const tab = (name: string) =>
			[...panel.querySelectorAll<HTMLButtonElement>('[role=tab]')].find((x) => x.textContent?.includes(name))!;
		tab('Buys').click();
		fixture.detectChanges();
		expect(panel.querySelector('table')?.textContent).toContain('player only');

		tab('Modules').click();
		fixture.detectChanges();
		expect(tab('Modules').textContent).toContain('4');
		const headings = [...panel.querySelectorAll('[role=tabpanel] h6')].map((x) =>
			x.textContent?.replace(/\s+/g, ' ').trim()
		);
		expect(headings).toEqual(['Production 3', 'Other 1']);
		expect(panel.querySelector('a[href="/modules/module_gen_prod_energycells_01"]')).not.toBeNull();
		expect(panel.textContent).toMatch(/3 ×\s+Energy Cell Production/);
		expect(panel.textContent).toContain('unknown_module');
	});

	it('selects the station named by the selection, and moves it with the arrow keys', async () => {
		const { fixture, component, element } = await setup([
			station({ code: 'AAA-1', name: 'Alpha' }),
			station({ code: 'BBB-2', name: 'Beta' }),
			station({ code: 'CCC-3', name: 'Gamma' }),
		]);
		fixture.componentRef.setInput('selected', 'BBB-2');
		fixture.detectChanges();
		expect(component.current()?.id).toBe('BBB-2');
		expect(element.querySelector('app-sector-station-details')?.textContent).toContain('Beta');

		const rows = () => [...element.querySelectorAll<HTMLButtonElement>('li button')];
		rows()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
		fixture.detectChanges();
		expect(component.selected()).toBe('CCC-3');
		expect(rows()[2].getAttribute('aria-current')).toBe('true');
		rows()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
		fixture.detectChanges();
		expect(component.selected()).toBe('AAA-1');

		rows()[1].click();
		fixture.detectChanges();
		expect(component.selected()).toBe('BBB-2');

		fixture.componentRef.setInput('selected', 'NOPE-0');
		fixture.detectChanges();
		expect(component.current()?.id).toBe('AAA-1');
	});
});
