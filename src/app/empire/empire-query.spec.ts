import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import type { EmpireBalanceRow } from './empire-balance';
import type { EmpireShipRow, EmpireStationRow } from './empire-model';
import { EmpireQuery } from './empire-query';

describe('EmpireQuery', () => {
	it('reads the tab and filters and writes them back without the defaults', () => {
		const state = EmpireQuery.read(convertToParamMap({ tab: 'stations', q: 'mine', size: 'Small', sector: 's1' }));
		expect(state).toEqual({
			tab: 'stations',
			model: { search: 'mine', sector: 's1', size: 'Small', role: '', station: '' },
		});
		expect(EmpireQuery.write(state)).toEqual({
			tab: 'stations',
			q: 'mine',
			sector: 's1',
			size: 'Small',
			role: null,
			station: null,
		});
		expect(EmpireQuery.read(convertToParamMap({ tab: 'balance', station: '[0x1]' }))).toMatchObject({
			tab: 'balance',
			model: { station: '[0x1]' },
		});
		expect(EmpireQuery.read(convertToParamMap({ tab: 'bogus' })).tab).toBe('ships');
		expect(EmpireQuery.write({ tab: 'ships', model: { ...EmpireQuery.DEFAULTS, search: '  ' } })).toEqual({
			tab: null,
			q: null,
			sector: null,
			size: null,
			role: null,
			station: null,
		});
	});

	it('filters ships by sector, size, role and text, and stations by sector and text', () => {
		const ships = [
			{
				label: 'Alpha',
				code: 'A-1',
				modelName: 'Mercury',
				fleet: '',
				sector: 's1',
				size: 'Medium',
				purpose: 'Trade',
			},
			{
				label: 'Beta',
				code: 'B-1',
				modelName: 'Elite',
				fleet: 'Home',
				sector: 's2',
				size: 'Small',
				purpose: 'Fight',
			},
		] as EmpireShipRow[];
		const model = { ...EmpireQuery.DEFAULTS };
		expect(EmpireQuery.ships(ships, { ...model, size: 'Small' }).map((x) => x.label)).toEqual(['Beta']);
		expect(EmpireQuery.ships(ships, { ...model, role: 'Trade' }).map((x) => x.label)).toEqual(['Alpha']);
		expect(EmpireQuery.ships(ships, { ...model, sector: 's2' }).map((x) => x.label)).toEqual(['Beta']);
		expect(EmpireQuery.ships(ships, { ...model, search: 'home' }).map((x) => x.label)).toEqual(['Beta']);
		expect(EmpireQuery.ships(ships, { ...model, search: 'merc' }).map((x) => x.label)).toEqual(['Alpha']);

		const stations = [
			{ name: 'Works', code: 'W-1', sector: 's1', products: ['Energy Cells'] },
			{ name: 'Dock', code: 'D-1', sector: 's2', products: [] },
		] as unknown as EmpireStationRow[];
		expect(EmpireQuery.stations(stations, { ...model, search: 'energy' }).map((x) => x.name)).toEqual(['Works']);
		expect(EmpireQuery.stations(stations, { ...model, sector: 's2' }).map((x) => x.name)).toEqual(['Dock']);
	});

	it('picks the stations of the production balance and filters its wares by name', () => {
		const stations = [
			{ id: '[0x1]', sector: 's1' },
			{ id: '[0x2]', sector: 's2' },
			{ id: '[0x3]', sector: 's2' },
		] as EmpireStationRow[];
		const model = { ...EmpireQuery.DEFAULTS };
		const ids = (rows: EmpireStationRow[]) => rows.map((x) => x.id);
		expect(ids(EmpireQuery.balanceStations(stations, model))).toEqual(['[0x1]', '[0x2]', '[0x3]']);
		expect(ids(EmpireQuery.balanceStations(stations, { ...model, sector: 's2' }))).toEqual(['[0x2]', '[0x3]']);
		expect(ids(EmpireQuery.balanceStations(stations, { ...model, sector: 's2', station: '[0x1]' }))).toEqual([
			'[0x1]',
		]);

		const wares = [{ name: 'Energy Cells' }, { name: 'Water' }] as EmpireBalanceRow[];
		expect(EmpireQuery.balance(wares, { ...model, search: 'wat' }).map((x) => x.name)).toEqual(['Water']);
	});
});
