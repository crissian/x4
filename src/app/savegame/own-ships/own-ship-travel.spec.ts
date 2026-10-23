import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { EquipmentService } from '../../shared/services/equipment.service';
import { ShipPerformance } from '../../shared/services/ship-performance';
import { ShipService } from '../../shared/services/ship.service';
import type { SaveShip } from '../map/save-map-model';
import { OwnShipTravel } from './own-ship-travel';

describe('OwnShipTravel', () => {
	const scout: SaveShip = {
		id: '[0x5f0a9]',
		code: 'MPA-451',
		macro: 'ship_par_s_scout_01_b',
		sector: 'cluster_29_sector001',
		engine: 'engine_par_s_combat_01_mk3',
		engines: 1,
	};

	it('times a ship with its installed engines', () => {
		const travel = TestBed.inject(OwnShipTravel).travel(scout);
		const ship = TestBed.inject(ShipService).getEntity(scout.macro)!;
		const engine = TestBed.inject(EquipmentService).getEntity(scout.engine!)!;
		const expected = ShipPerformance.flightSpeeds(ship, engine, 1);
		expect(travel).toEqual({ speed: expected.travel, charge: expected.travelCharge });
		expect(travel!.speed).toBeGreaterThan(0);
		// two engines double the thrust
		expect(TestBed.inject(OwnShipTravel).travel({ ...scout, engines: 2 })!.speed).toBeCloseTo(2 * travel!.speed);
	});

	it('gives nothing for an unknown ship or engine', () => {
		const travel = TestBed.inject(OwnShipTravel);
		expect(travel.travel({ ...scout, engine: undefined, engines: undefined })).toBeUndefined();
		expect(travel.travel({ ...scout, engine: 'engine_modded' })).toBeUndefined();
		expect(travel.travel({ ...scout, macro: 'ship_modded' })).toBeUndefined();
	});
});
