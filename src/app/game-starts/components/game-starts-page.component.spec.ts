import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { GameStartsStore } from '../game-starts-store';
import { GameStartDetailComponent } from './game-start-detail.component';
import GameStartsPageComponent from './game-starts-page.component';

describe('GameStartsPageComponent', () => {
	beforeEach(() => localStorage.clear());

	async function setup(url: string) {
		TestBed.configureTestingModule({
			providers: [
				provideRouter(
					[
						{ path: 'game-starts', component: GameStartsPageComponent },
						{ path: 'game-starts/:id', component: GameStartDetailComponent },
					],
					withComponentInputBinding()
				),
			],
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
		return { harness, element: harness.routeNativeElement!, settle, router: TestBed.inject(Router) };
	}

	it('shows the new game starts as cards with money, ship and location links', async () => {
		const { element, harness } = await setup('/game-starts');
		const store = harness.routeDebugElement!.injector.get(GameStartsStore);
		const cards = element.querySelectorAll('app-game-start-card');
		expect(cards.length).toBe(store.filtered().length);
		expect(store.filtered().some((x) => x.start.type === 'tutorial')).toBe(false);
		const trade = [...cards].find((x) => x.textContent?.includes('The Unworthy Entrepreneur'))!;
		expect(trade.textContent).toContain('200,000 Cr');
		expect(trade.querySelector('a[href="/ships/ship_tel_s_scout_01_a"]')).not.toBeNull();
		expect(trade.querySelector('a[href^="/sectors/"]')).not.toBeNull();
		expect(trade.textContent).toContain('Unlock first');
	});

	it('reads the filters from the URL and shows a table', async () => {
		const { element, harness } = await setup('/game-starts?type=story&view=table');
		const store = harness.routeDebugElement!.injector.get(GameStartsStore);
		expect(store.filtered().every((x) => x.start.type === 'guided' || x.start.type === 'assisted')).toBe(true);
		expect(element.querySelector('app-data-grid')).not.toBeNull();
	});

	it('hides the starts of DLCs not owned and keeps the choice', async () => {
		const { harness, settle } = await setup('/game-starts');
		const store = harness.routeDebugElement!.injector.get(GameStartsStore);
		const all = store.filtered().length;
		store.owned.update((x) => ({ ...x, 4: false }));
		await settle();
		expect(store.filtered().some((x) => x.start.version === 4)).toBe(false);
		expect(store.filtered().length).toBeLessThan(all);
		expect(store.hiddenByDlc()).toBe(all - store.filtered().length);
		expect(JSON.parse(localStorage.getItem('game-starts-owned')!)).toEqual([4]);
	});

	it('shows a start with its loadout, reputation and blueprints', async () => {
		const { element } = await setup('/game-starts/x4ep1_gamestart_terran1');
		expect(element.textContent).toContain('Terran Cadet');
		expect(element.textContent).toContain('Ship loadout');
		expect(element.textContent).toContain('Starting reputation');
		expect(element.querySelector('a[href="/factions/terran"]')).not.toBeNull();
		expect(element.querySelector('a[href^="/modules/"]')).not.toBeNull();
		expect(element.querySelector('a[href^="/map?sector="]')).not.toBeNull();
	});
});
