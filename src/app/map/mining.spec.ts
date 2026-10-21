import { Ship, Ware } from '../shared/services/model/model';
import { minerCapacity, minersFor, miningTrip } from './mining';

const ore = { id: 'ore', name: 'Ore', volume: 10, transport: 'Solid', price: { min: 40, avg: 50, max: 60 } } as Ware;

function ship(id: string, purpose: string, cargo: { max: number; type: string }[]): Ship {
	return { id, name: id, purpose, cargo: cargo.map((x) => ({ max: x.max, types: [{ id: x.type, name: x.type }] })) } as Ship;
}

describe('mining', () => {
	it('uses only holds of the ware transport type', () => {
		expect(minerCapacity(ship('a', 'Mine', [{ max: 5000, type: 'solid' }, { max: 1000, type: 'container' }]), ore)).toBe(5000);
	});

	it('lists mining ships able to carry the ware, largest first', () => {
		const ships = [
			ship('small', 'Mine', [{ max: 1000, type: 'solid' }]),
			ship('gas', 'Mine', [{ max: 9000, type: 'liquid' }]),
			ship('big', 'Mine', [{ max: 8000, type: 'solid' }]),
			ship('trader', 'Trade', [{ max: 9000, type: 'solid' }]),
		];
		expect(minersFor(ships, ore).map((x) => x.id)).toEqual(['big', 'small']);
	});

	it('computes the value per hour of a round trip', () => {
		// 1000 units * 50 = 50,000 per trip; 2 * 120 s + 10 min + 60 s = 900 s
		const trip = miningTrip(120, 10_000, ore, 50, 10);
		expect(trip.units).toBe(1000);
		expect(trip.tripTime).toBe(900);
		expect(trip.perHour).toBe(200_000);
	});
});
