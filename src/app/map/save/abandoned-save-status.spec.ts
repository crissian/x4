import { describe, expect, it } from 'vitest';
import type { SaveOwnerlessShip } from '../../savegame/empire/save-empire-model';
import type { AbandonedShip } from '../../shared/services/model/model';
import { AbandonedSaveStatus } from './abandoned-save-status';

describe('AbandonedSaveStatus', () => {
	const item = (ship: string, sector: string, x = 0, z = 0): AbandonedShip => ({
		ship,
		sector,
		version: 0,
		x,
		y: 0,
		z,
	});
	const save = (id: string, macro: string, sector: string, x = 0, z = 0, zone?: string): SaveOwnerlessShip => ({
		id,
		code: id,
		macro,
		sector,
		x,
		z,
		...(zone ? { zone } : {}),
	});
	const position = (ship: SaveOwnerlessShip) => (ship.zone === 'z1' ? { x: ship.x + 100, z: ship.z } : ship);

	it('marks the ships still ownerless in their sector, and lists the other ownerless ships', () => {
		const result = AbandonedSaveStatus.match(
			[item('fighter', 's1'), item('miner', 's2'), item('fighter', 's3')],
			[save('a', 'fighter', 's1'), save('b', 'fighter', 's9'), save('c', 'racer', 's3')],
			position
		);
		expect(result.statuses).toEqual(['unclaimed', 'gone', 'gone']);
		expect(result.extras.map((x) => x.id)).toEqual(['b', 'c']);
	});

	it('needs the listed position, and takes each save ship only once', () => {
		const result = AbandonedSaveStatus.match(
			[item('fighter', 's1', 100, 0), item('fighter', 's1', 100, 0), item('fighter', 's1', 100, 0)],
			[save('far', 'fighter', 's1', -500, 0), save('zoned', 'fighter', 's1', 0, 0, 'z1')],
			position
		);
		expect(result.statuses).toEqual(['unclaimed', 'gone', 'gone']);
		expect(result.extras.map((x) => x.id)).toEqual(['far']);
	});
});
