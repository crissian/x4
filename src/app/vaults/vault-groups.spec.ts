import { describe, expect, it } from 'vitest';
import type { Sector } from '../shared/services/model/model';
import { VaultEntry } from './data-vault';
import { VaultGroups } from './vault-groups';

class GroupFixtures {
	static entry(id: string, sector?: string): VaultEntry {
		return { id, macro: 'landmarks_vault_01', sector, version: 0, blueprints: [] };
	}

	static sector(id: string): Sector | undefined {
		return ({ a: { id: 'a', name: 'Zeta' }, b: { id: 'b', name: 'Alpha' } } as unknown as Record<string, Sector>)[
			id
		];
	}
}

describe('VaultGroups', () => {
	it('groups by sector name with the random vaults last', () => {
		const entries = [
			GroupFixtures.entry('1', 'a'),
			GroupFixtures.entry('2'),
			GroupFixtures.entry('3', 'b'),
			GroupFixtures.entry('4', 'a'),
		];
		const groups = VaultGroups.bySector(entries, (id) => GroupFixtures.sector(id));
		expect(groups.map((x) => [x.key, x.entries.map((e) => e.id)])).toEqual([
			['b', ['3']],
			['a', ['1', '4']],
			['', ['2']],
		]);
		expect(groups[0].sector?.name).toBe('Alpha');
	});

	it('counts the vaults the player has', () => {
		const entries = [GroupFixtures.entry('1'), GroupFixtures.entry('2'), GroupFixtures.entry('3')];
		expect(VaultGroups.progress(entries, (x) => x.id !== '2')).toEqual({ done: 2, total: 3 });
	});
});
