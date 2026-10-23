import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import type { SaveResearch } from '../../savegame/map/save-map-model';
import { SavegameStore } from '../../savegame/savegame-store';
import { ResearchStore } from '../research-store';
import ResearchPageComponent from './research-page.component';

describe('ResearchPageComponent', () => {
	beforeEach(() => localStorage.clear());

	async function setup(url = '/research', research: SaveResearch | null = null, status = 'ok') {
		const active = signal(
			research && {
				id: 'x',
				schemaVersion: 8,
				info: { saveName: 'Save 5', gameTime: 7380, money: 0 },
				data: { research },
			}
		);
		TestBed.configureTestingModule({
			providers: [
				provideRouter([{ path: 'research', component: ResearchPageComponent }]),
				{
					provide: SavegameStore,
					useValue: { active, activeId: signal(research ? 'x' : null), status: () => status },
				},
			],
		});
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl(url, ResearchPageComponent);
		const settle = async () => {
			await harness.fixture.whenStable();
			TestBed.tick();
			await harness.fixture.whenStable();
			harness.detectChanges();
		};
		await settle();
		const element = harness.routeNativeElement!;
		const store = harness.routeDebugElement!.injector.get(ResearchStore);
		return { element, store, settle, router: TestBed.inject(Router) };
	}

	it('shows the tree and where to start without a save', async () => {
		const { element, store } = await setup();
		expect(store.status()).toBe('none');
		expect(element.textContent).toContain('Where to start');
		expect(element.querySelector('a[href="/saves"]')).not.toBeNull();
		// the hidden projects stay out of the tree
		const names = [...element.querySelectorAll('.node-name')].map((x) => x.textContent);
		expect(names.length).toBe(store.projects.filter((x) => !x.hidden).length);
		expect(element.querySelector('[data-research-next]')?.textContent).toContain(
			store.progress().get('research_module_dock')!.name
		);
	});

	it('marks the research of the save and lists what is available next', async () => {
		const { element, store } = await setup('/research', [
			'research_module_dock',
			'research_module_production',
			'research_module_storage',
		]);
		expect(store.status()).toBe('ready');
		expect(element.textContent).toContain('3 of');
		const next = element.querySelector('[data-research-next]')!.textContent!;
		expect(next).toContain('Next available');
		expect(next).toContain(store.progress().get('research_module_defence')!.name);
		expect(next).not.toContain(store.progress().get('research_module_dock')!.name);
	});

	it('shows the selected project from the URL with the total of its path', async () => {
		const { element, store } = await setup('/research?id=research_teleportation_range_02');
		expect(store.selected()?.id).toBe('research_teleportation_range_02');
		const steps = [...element.querySelectorAll('[data-research-steps] li')].map((x) => x.textContent?.trim());
		expect(steps).toEqual(
			['research_teleportation', 'research_teleportation_range_01', 'research_teleportation_range_02'].map(
				(id) => store.progress().get(id)!.name
			)
		);
	});

	it('names the mission a mod research needs', async () => {
		const { element } = await setup('/research?id=research_mod_ship_mk2');
		expect(element.querySelector('[data-research-missions]')?.textContent).toBeTruthy();
	});

	it('keeps the view and selection in the URL', async () => {
		const { store, settle, router } = await setup();
		store.view.set('list');
		store.select('research_seta');
		await settle();
		expect(router.url).toBe('/research?view=list&id=research_seta');
	});
});
