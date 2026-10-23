import { describe, expect, it } from 'vitest';
import type { WareStationFlow } from '../economy/economy-model';
import type { SaveOffer, SaveStation } from '../savegame/map/save-map-model';
import { SupplyDemandDetail } from './supply-demand-detail';

const station = (code: string, offers: SaveOffer[] = [], owner = 'argon') =>
	({ code, macro: 'm', owner, sector: 's', x: 0, z: 0, known: true, modules: [], offers }) as SaveStation;
const flow = (code: string, produced: number, consumed: number): WareStationFlow => ({
	station: station(code),
	produced,
	consumed,
});

describe('SupplyDemandDetail', () => {
	it('lists the 5 biggest producers and consumers', () => {
		const flows = [1, 2, 3, 4, 5, 6, 7].map((x) => flow(`S${x}`, x, 10 - x));
		flows.push(flow('IDLE', 0, 0));
		expect(SupplyDemandDetail.producers(flows).map((x) => x.station.code)).toEqual(['S7', 'S6', 'S5', 'S4', 'S3']);
		expect(SupplyDemandDetail.consumers(flows).map((x) => x.station.code)).toEqual(['S1', 'S2', 'S3', 'S4', 'S5']);
	});

	it('orders the offers by price, leaves out shady and empty ones', () => {
		const sell = (price: number, extra: Partial<SaveOffer> = {}): SaveOffer => ({
			ware: 'w',
			sell: true,
			price,
			amount: 5,
			...extra,
		});
		const stations = [
			station('A', [sell(30), sell(10, { playerOnly: true }), sell(5, { amount: 0 })]),
			station('B', [sell(20), { ...sell(99), sell: false }, { ...sell(1), ware: 'other' }]),
		];
		expect(SupplyDemandDetail.offers(stations, 'w', true).map((x) => x.price)).toEqual([20, 30]);
		expect(SupplyDemandDetail.offers(stations, 'w', false).map((x) => x.price)).toEqual([99]);
	});

	it('leaves out the stations of factions hostile to the player', () => {
		const offer: SaveOffer = { ware: 'energycells', sell: true, price: 10, amount: 5 };
		const stations = [
			station('XEN', [offer], 'xenon'),
			station('ARG', [{ ...offer, price: 16 }], 'argon'),
			station('OWN', [{ ...offer, price: 12 }], 'player'),
		];
		const relations = { xenon: -1, argon: 0.1 };
		expect(SupplyDemandDetail.offers(stations, 'energycells', true, relations).map((x) => x.station.code)).toEqual([
			'OWN',
			'ARG',
		]);
		expect(
			SupplyDemandDetail.offers(stations, 'energycells', true, relations, false).map((x) => [
				x.station.code,
				x.hostile,
			])
		).toEqual([
			['XEN', true],
			['OWN', false],
			['ARG', false],
		]);
	});
});
