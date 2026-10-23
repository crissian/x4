import { TestBed } from '@angular/core/testing';
import type { Equipment } from './model/model';
import { ShipListService } from './ship-list.service';
import { ShipStatsService } from './ship-stats.service';
import { ShipService } from './ship.service';
import { TravelDrives } from './travel-drives';

describe('TravelDrives', () => {
	const fallback = { speed: 1000, charge: 0 };

	it('takes the travel speed and the charge of the fastest drive', () => {
		expect(TravelDrives.options({ travel: { speed: 4200, charge: 7 } }, fallback)).toEqual({
			speed: 4200,
			charge: 7,
		});
		expect(TravelDrives.canTravel({ travel: { speed: 4200, charge: 7 } })).toBe(true);
	});

	it('falls back for a ship without a travel speed or drive', () => {
		expect(TravelDrives.options({ travel: { speed: 0 } }, fallback)).toEqual(fallback);
		expect(TravelDrives.options({}, fallback)).toEqual(fallback);
		expect(TravelDrives.canTravel({ travel: { speed: 0 } })).toBe(false);
		expect(TravelDrives.canTravel({})).toBe(false);
	});

	it('matches the travel of every ship worked out from its engines', () => {
		const stats = TestBed.inject(ShipStatsService);
		const list = TestBed.inject(ShipListService);
		const score = (x: Equipment) => (x.thrust?.forward ?? 0) * (x.travel?.thrust ?? 0);
		for (const ship of TestBed.inject(ShipService).getEntities()) {
			// the engine with the best travel thrust sets the charge time
			const fastest = stats
				.engines(ship)
				.reduce<Equipment | undefined>((best, x) => (!best || score(x) > score(best) ? x : best), undefined);
			const live = { speed: stats.maxStats(ship).travel, charge: fastest?.travel?.charge };

			expect({ id: ship.id, speed: ship.travel?.speed ?? 0, charge: ship.travel?.charge }).toEqual({
				id: ship.id,
				...live,
			});
			expect(list.getEntity(ship.id)?.travel).toEqual(ship.travel);
		}
	});
});
