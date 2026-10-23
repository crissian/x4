import type { SaveVault } from '../savegame/extractors/vaults-extractor';
import { DataVault, VaultEntry } from './data-vault';

/** Merges the vaults of the game data with those of a save. */
export class VaultMatcher {
	/** The game data vaults as entries, without save state. */
	static entries(data: readonly DataVault[]): VaultEntry[] {
		return data.map((vault) => VaultMatcher.entry(vault));
	}

	/**
	 * The vaults of a save: game data vaults it holds and game data vaults of its sectors it does not hold yet (a story
	 * vault). Vaults only the save has are left out. A randomly placed vault is matched by its macro, a placed one by its
	 * macro and the nearest spot in its sector (the game may move it to a free spot). `zones` gives the position of
	 * the predefined zones in their sector.
	 */
	static merge(
		data: readonly DataVault[],
		save: readonly SaveVault[],
		sectors: ReadonlySet<string>,
		zones: ReadonlyMap<string, { x: number; z: number }>
	): VaultEntry[] {
		const left = save.flatMap((vault) => {
			const zone = vault.zone ? zones.get(vault.zone) : { x: 0, z: 0 };
			return zone
				? [{ ...vault, x: VaultMatcher.round(zone.x + vault.x), z: VaultMatcher.round(zone.z + vault.z) }]
				: [];
		});
		const result: VaultEntry[] = [];
		for (const vault of data) {
			const candidates = left.filter(
				(x) => x.macro === vault.macro && (!vault.sector || x.sector === vault.sector)
			);
			const found = vault.sector ? VaultMatcher.nearest(vault, candidates) : candidates[0];
			if (found) {
				left.splice(left.indexOf(found), 1);
				result.push({
					...VaultMatcher.entry(vault),
					sector: found.sector,
					x: found.x,
					y: found.y,
					z: found.z,
					save: { present: true, known: found.known, opened: VaultMatcher.opened(vault, found) },
				});
			} else if (vault.sector && sectors.has(vault.sector)) {
				result.push({ ...VaultMatcher.entry(vault), save: { present: false, known: false, opened: false } });
			}
		}
		return result;
	}

	private static entry(vault: DataVault): VaultEntry {
		return {
			id: vault.id,
			macro: vault.macro,
			sector: vault.sector,
			x: vault.x,
			y: vault.y,
			z: vault.z,
			version: vault.version,
			timeline: vault.timeline,
			name: vault.name,
			blueprints: vault.blueprints ?? [],
			condition: vault.condition,
		};
	}

	/**
	 * A placed vault is opened once its signal leak is repaired (`<unlock state="unlocked">`; in a save every such
	 * vault has its timeline entry). A randomly placed (Erlking) vault never records that, so the save cannot tell.
	 */
	private static opened(vault: DataVault, save: SaveVault): boolean | undefined {
		return vault.sector ? save.unlocked : undefined;
	}

	private static nearest<T extends { x: number; z: number }>(vault: DataVault, candidates: T[]): T | undefined {
		let best: T | undefined;
		let bestDistance = Infinity;
		for (const candidate of candidates) {
			const distance = Math.hypot(candidate.x - (vault.x ?? 0), candidate.z - (vault.z ?? 0));
			if (distance <= bestDistance) {
				best = candidate;
				bestDistance = distance;
			}
		}
		return best;
	}

	private static round(km: number): number {
		return Math.round(km * 10) / 10;
	}
}
