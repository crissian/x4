import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LazyValue } from '../../core/lazy-value';
import { SavegameStore } from '../../savegame/savegame-store';
import { Size } from '../../shared/services/data/size-data';
import type { Faction, Ship } from '../../shared/services/model/model';
import { ShipSellersNearComponent } from './ship-sellers-near.component';

describe('ShipSellersNearComponent', () => {
	async function setup(ship: Ship) {
		localStorage.removeItem('ship-sellers-from');
		TestBed.configureTestingModule({
			providers: [provideRouter([]), { provide: SavegameStore, useValue: { active: signal(null) } }],
		});
		const fixture = TestBed.createComponent(ShipSellersNearComponent);
		fixture.componentRef.setInput('ship', ship);
		await fixture.whenStable();
		TestBed.tick();
		await LazyValue.settled();
		fixture.detectChanges();
		return fixture.nativeElement as HTMLElement;
	}

	const ship = (size: Size, ...owners: string[]) =>
		({ id: 'x', size, owners: owners.map((id) => ({ id }) as Faction), license: 'militaryship' }) as Ship;

	it('shows the requirement only without a save', async () => {
		const element = await setup(ship(Size.large, 'argon'));
		expect(element.textContent).toContain('At game start');
		expect(element.textContent).toContain('Needs +10 rep');
		expect(element.textContent).toContain('Load a savegame');
		expect(element.querySelector('a[href="/sectors/cluster_14_sector001"]')?.textContent).toBe('Argon Prime');
		expect(element.querySelector('a[href="/factions/argon"]')).not.toBeNull();
		expect(element.querySelector('th')?.parentElement?.textContent).not.toContain('Jumps');
	});

	it('shows jumps and times once a from sector is picked', async () => {
		const element = await setup(ship(Size.large, 'argon'));
		const input = element.querySelector<HTMLInputElement>('#ship-sellers-from')!;
		input.dispatchEvent(new FocusEvent('focus'));
		input.value = 'Argon Prime';
		input.dispatchEvent(new Event('input'));
		TestBed.tick();
		// the owner faction shows after the name
		expect(
			[...element.querySelectorAll('[role="option"]')].map((x) => x.textContent?.trim().replace(/\s+/g, ' '))
		).toContain('Argon Prime Argon Federation');
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
		TestBed.tick();
		expect(element.textContent).toContain('Jumps');
		expect(element.querySelector('tbody td.text-right')?.textContent?.trim()).toBe('0');
	});

	it('says when no station sells the ship', async () => {
		const element = await setup(ship(Size.large, 'buccaneers'));
		expect(element.textContent).toContain('No station sells it at game start.');
		expect(element.querySelector('table')).toBeNull();
	});
});
