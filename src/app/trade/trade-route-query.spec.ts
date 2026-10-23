import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { TradeRouteLookups, TradeRouteQuery } from './trade-route-query';

const LOOKUPS: TradeRouteLookups = {
	ship: (id) => id === 'hauler' || id === 'own-0x1',
	ware: (id) => id === 'energycells',
	sectorName: (id) => (id === 'ap' ? 'Argon Prime' : undefined),
	sectorId: (name) => (name === 'Argon Prime' ? 'ap' : undefined),
};

describe('TradeRouteQuery', () => {
	const read = (params: Record<string, string>) => TradeRouteQuery.read(convertToParamMap(params), LOOKUPS);

	it('reads the defaults from an empty URL and writes nothing back', () => {
		const model = read({});
		expect(model).toEqual(TradeRouteQuery.DEFAULTS);
		expect(model.playerOnly).toBe(false);
		expect(model.bestPerOffer).toBe(true);
		expect(Object.values(TradeRouteQuery.write(model, LOOKUPS)).every((x) => x === null)).toBe(true);
	});

	it('keeps player-only offers and every buyer in the URL when turned on', () => {
		const model = read({ shady: '1', best: '0' });
		expect(model.playerOnly).toBe(true);
		expect(model.bestPerOffer).toBe(false);
		expect(TradeRouteQuery.write(model, LOOKUPS)).toEqual(expect.objectContaining({ shady: '1', best: '0' }));
	});

	it('reads the old link that turned player-only offers off', () => {
		expect(read({ shady: '0' }).playerOnly).toBe(false);
	});

	it('keeps an own ship without the custom numbers', () => {
		const model = read({ ship: 'own-0x1', cargo: '500' });
		expect(model.ship).toBe('own-0x1');
		expect(model.cargo).toBe(TradeRouteQuery.DEFAULTS.cargo);
		const params = TradeRouteQuery.write({ ...model, cargo: 500 }, LOOKUPS);
		expect(params['ship']).toBe('own-0x1');
		expect(params['cargo']).toBeNull();
	});

	it('falls back to the custom ship for an unknown ship', () => {
		expect(read({ ship: 'nope', cargo: '500' })).toEqual(expect.objectContaining({ ship: 'custom', cargo: 500 }));
	});
});
