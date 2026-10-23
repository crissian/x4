import { describe, expect, it } from 'vitest';
import type { ShipListItem, Ware } from '../shared/services/model/model';
import { TradeShips } from './trade-ships';

describe('trade ships', () => {
	const container = { id: 'container', name: 'Container' };
	const solid = { id: 'solid', name: 'Solid' };
	const ship = (name: string, cargo?: ShipListItem['cargo'], travel?: ShipListItem['travel']) =>
		({ id: name, name, cargo, travel }) as unknown as ShipListItem;
	const holds = [
		{ max: 2300, types: [container] },
		{ max: 500, types: [container, solid] },
	] as ShipListItem['cargo'];

	it('sums cargo per type', () => {
		expect(TradeShips.spec(ship('Hauler', holds, { speed: 1000 })).capacity).toEqual({
			container: 2800,
			solid: 500,
		});
	});

	it('takes speed and charge from the fastest travel drive', () => {
		const spec = TradeShips.spec(ship('Hauler', holds, { speed: 4200, charge: 7 }));
		expect(spec.speed).toBe(4200);
		expect(spec.charge).toBe(7);
		expect(TradeShips.spec(ship('Hauler', holds, { speed: 4200 })).charge).toBe(TradeShips.CUSTOM.charge);
	});

	it('lists only ships with cargo and travel speed', () => {
		const travel = { speed: 10 };
		const ships = [
			ship('B', [{ max: 1, types: [container] }] as ShipListItem['cargo'], travel),
			ship('NoCargo', undefined, travel),
			ship('Hauler', holds, travel),
			ship('NoDrive', holds, { speed: 0 }),
		];
		expect(TradeShips.list(ships).map((x) => x.name)).toEqual(['B', 'Hauler']);
	});

	it('maps a ware to its transport id', () => {
		const ware = { volume: 4, transport: 'Container', illegal: [{ id: 'loanshark' }] } as unknown as Ware;
		expect(TradeShips.wareInfo(ware)).toEqual({ volume: 4, transport: 'container', illegalIn: ['loanshark'] });
		expect(TradeShips.wareInfo({ volume: 1, transport: 'Liquid' } as Ware).illegalIn).toEqual([]);
	});

	it('builds a custom ship', () => {
		expect(TradeShips.custom(100, 'solid', 50, 2)).toEqual({ capacity: { solid: 100 }, speed: 50, charge: 2 });
	});
});
