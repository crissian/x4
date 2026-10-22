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
		return { component: fixture.componentInstance, element: fixture.nativeElement as HTMLElement };
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
});
