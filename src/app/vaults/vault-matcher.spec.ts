import { describe, expect, it } from 'vitest';
import type { SaveVault } from '../savegame/extractors/vaults-extractor';
import { DataVault } from './data-vault';
import { VaultMatcher } from './vault-matcher';

class VaultFixtures {
	static readonly DATA: DataVault[] = [
		{
			id: 'datavault_1',
			macro: 'landmarks_vault_01',
			sector: 's1',
			version: 0,
			x: 10,
			y: 0,
			z: 20,
			timeline: 't1',
			name: 'One',
		},
		{
			id: 'datavault_2',
			macro: 'landmarks_vault_01',
			sector: 's1',
			version: 0,
			x: -50,
			y: 0,
			z: -50,
			timeline: 't2',
		},
		{ id: 'datavault_29', macro: 'landmarks_vault_04', sector: 's2', version: 7, x: 0, z: 0, condition: 'story' },
		{ id: 'datavault_30', macro: 'landmarks_vault_04', sector: 's9', version: 2, x: 0, z: 0 },
		{
			id: 'erlking_blueprint_1',
			macro: 'landmarks_erlking_vault_01',
			version: 3,
			blueprints: [{ id: 'engine_x', name: 'Engine' }],
		},
	];

	static save(vault: Partial<SaveVault>): SaveVault {
		return {
			macro: 'landmarks_vault_01',
			sector: 's1',
			x: 0,
			y: 0,
			z: 0,
			known: false,
			unlocked: false,
			...vault,
		};
	}
}

describe('VaultMatcher', () => {
	it('lists the game data without save state', () => {
		const entries = VaultMatcher.entries(VaultFixtures.DATA);
		expect(entries.map((x) => x.id)).toEqual(VaultFixtures.DATA.map((x) => x.id));
		expect(entries[0].save).toBeUndefined();
		expect(entries[4].blueprints).toEqual([{ id: 'engine_x', name: 'Engine' }]);
	});

	it('matches placed vaults by the nearest spot, adding the zone position', () => {
		const save = [
			VaultFixtures.save({ zone: 'z1', x: -1, z: -1, known: true, unlocked: true }),
			VaultFixtures.save({ x: 11, z: 19 }),
		];
		const zones = new Map([['z1', { x: -50, z: -50 }]]);
		const entries = VaultMatcher.merge(VaultFixtures.DATA, save, new Set(['s1']), zones);
		expect(entries.find((x) => x.id === 'datavault_1')).toMatchObject({
			x: 11,
			z: 19,
			save: { present: true, known: false, opened: false },
		});
		expect(entries.find((x) => x.id === 'datavault_2')).toMatchObject({
			x: -51,
			z: -51,
			save: { present: true, known: true, opened: true },
		});
	});

	it('places a random vault where the save has it, without an opened state', () => {
		const save = [
			VaultFixtures.save({
				macro: 'landmarks_erlking_vault_01',
				sector: 's5',
				x: 3,
				z: 4,
				known: true,
				unlocked: true,
			}),
		];
		const entry = VaultMatcher.merge(VaultFixtures.DATA, save, new Set(), new Map()).find(
			(x) => x.id === 'erlking_blueprint_1'
		);
		expect(entry).toMatchObject({ sector: 's5', x: 3, z: 4 });
		expect(entry?.save).toEqual({ present: true, known: true, opened: undefined });
	});

	it('keeps vaults of the save sectors it does not hold and drops those of other sectors', () => {
		const entries = VaultMatcher.merge(VaultFixtures.DATA, [], new Set(['s2']), new Map());
		expect(entries.map((x) => x.id)).toEqual(['datavault_29']);
		expect(entries[0].save).toEqual({ present: false, known: false, opened: false });
	});

	it('leaves out the vaults only the save has', () => {
		const save = [
			VaultFixtures.save({ macro: 'landmarks_research_vault_01', sector: 's3', x: 1, z: 2, unlocked: true }),
			VaultFixtures.save({ macro: 'landmarks_research_vault_01', sector: 's3', zone: 'nowhere' }),
		];
		expect(VaultMatcher.merge(VaultFixtures.DATA, save, new Set(), new Map())).toEqual([]);
	});
});
