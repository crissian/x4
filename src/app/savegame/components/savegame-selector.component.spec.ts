import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { SavegameListItem } from '../savegame-model';
import { SavegameStore } from '../savegame-store';
import { SavegameSelectorComponent } from './savegame-selector.component';

describe('savegame selector', () => {
	const setup = async (saves: SavegameListItem[]) => {
		const store = { saves: signal(saves), activeId: signal<string | null>(null), select: () => undefined };
		TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: SavegameStore, useValue: store }] });
		const fixture = TestBed.createComponent(SavegameSelectorComponent);
		await fixture.whenStable();
		return fixture.nativeElement as HTMLElement;
	};

	it('links to the saves page next to the select when there are saves', async () => {
		const element = await setup([
			{ id: 'a', info: { playerName: 'P', saveName: 'S', gameTime: 0 } } as unknown as SavegameListItem,
		]);
		expect(element.querySelector('select')).not.toBeNull();
		const link = element.querySelector('a')!;
		expect(link.getAttribute('href')).toBe('/saves');
		expect(link.getAttribute('aria-label')).toBe('Manage savegames');
		expect(link.getAttribute('title')).toBe('Manage savegames');
	});

	it('keeps the saves page reachable when there are no saves', async () => {
		const element = await setup([]);
		expect(element.querySelector('select')).toBeNull();
		expect(element.querySelector('a')!.getAttribute('href')).toBe('/saves');
	});
});
