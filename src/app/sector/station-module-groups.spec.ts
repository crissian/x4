import { describe, expect, it } from 'vitest';
import { ModuleTypes } from '../shared/services/data/module-types-data';
import { StationModuleGroups } from './station-module-groups';

describe('StationModuleGroups', () => {
	const line = (id: string, count: number, type?: ModuleTypes) => ({ id, count, name: id, type });

	it('groups the modules by kind in a fixed order, totalling the counts and leaving out empty groups', () => {
		const groups = StationModuleGroups.group([
			line('dock', 1, ModuleTypes.dockarea),
			line('unknown', 2),
			line('hab', 2, ModuleTypes.habitation),
			line('prod-a', 3, ModuleTypes.production),
			line('pier', 2, ModuleTypes.pier),
			line('prod-b', 1, ModuleTypes.production),
			line('cross', 5, ModuleTypes.connectionmodule),
			line('radar', 1, ModuleTypes.radar),
			line('recycler', 1, ModuleTypes.recycling),
			line('solid', 4, ModuleTypes.storage),
			line('turret', 6, ModuleTypes.defencemodule),
		]);
		expect(groups.map((x) => [x.id, x.total])).toEqual([
			['production', 4],
			['processing', 1],
			['storage', 4],
			['habitat', 2],
			['docks', 3],
			['defence', 6],
			['connection', 5],
			['other', 3],
		]);
		expect(groups[0].modules.map((x) => x.id)).toEqual(['prod-a', 'prod-b']);
		expect(groups[7].modules.map((x) => x.id)).toEqual(['unknown', 'radar']);
	});

	it('returns no groups for a station without modules', () => {
		expect(StationModuleGroups.group([])).toEqual([]);
	});
});
