import { describe, expect, it } from 'vitest';
import type { Equipment, Ship, Ware } from '../shared/services/model/model';
import type { ShipStatsService } from '../shared/services/ship-stats.service';
import { TradeShips } from './trade-ships';

describe('trade ships', () => {
	const container = { id: 'container', name: 'Container' };
	const solid = { id: 'solid', name: 'Solid' };
	const ship = (name: string, cargo?: Ship['cargo']) => ({ id: name, name, cargo }) as unknown as Ship;
	const hauler = ship('Hauler', [
		{ max: 2300, types: [container] },
		{ max: 500, types: [container, solid] },
	] as Ship['cargo']);
	const engine = (forward: number, thrust: number, charge: number) =>
		({ thrust: { forward }, travel: { thrust, charge } }) as unknown as Equipment;
	const stats = (travel: number, engines: Equipment[] = []) =>
		({ maxStats: () => ({ travel }), engines: () => engines }) as unknown as ShipStatsService;

	it('sums cargo per type', () => {
		expect(TradeShips.spec(hauler, stats(1000)).capacity).toEqual({ container: 2800, solid: 500 });
	});

	it('takes speed and charge from the fastest travel drive', () => {
		const spec = TradeShips.spec(hauler, stats(4200, [engine(1, 1, 9), engine(5, 20, 7)]));
		expect(spec.speed).toBe(4200);
		expect(spec.charge).toBe(7);
		expect(TradeShips.spec(hauler, stats(4200)).charge).toBe(TradeShips.CUSTOM.charge);
	});

	it('lists only ships with cargo and travel speed', () => {
		const ships = [ship('B', [{ max: 1, types: [container] }] as Ship['cargo']), ship('NoCargo'), hauler];
		expect(TradeShips.list(ships, stats(10)).map((x) => x.name)).toEqual(['B', 'Hauler']);
		expect(TradeShips.list(ships, stats(0))).toEqual([]);
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
