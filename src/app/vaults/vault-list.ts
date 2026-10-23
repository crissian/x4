import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { LazyValue } from '../core/lazy-value';
import { LocalStorage } from '../core/services/local-storage';
import { ActiveSave } from '../savegame/active-save';
import { DataVaults } from '../shared/services/data/data-vaults-data';
import { DataVault, VaultEntry } from './data-vault';
import { VaultMatcher } from './vault-matcher';

/**
 * The data vaults of the game data, merged with the active save when it has vault data. Without such a save the
 * player ticks the vaults they found; the ticks are kept in local storage.
 */
@Injectable({ providedIn: 'root' })
export class VaultList {
	private static readonly DATA = DataVaults as DataVault[];

	private readonly activeSave = inject(ActiveSave);
	private readonly saveVaults = this.activeSave.vaults;
	/** The zone positions load in their own chunk, once a save has vault data. */
	private readonly zones = new LazyValue(
		() => !!this.saveVaults(),
		async () => {
			const { Zones } = await import('../shared/services/data/zones-data');
			return new Map(Zones.all.map((x) => [x.id, x]));
		}
	).value;

	/** The vaults the player ticked as found, by id; every vault of the game data has a key. */
	readonly found = LocalStorage.persistedSignal<Record<string, boolean>>('vaults-found', VaultList.ticks([]), {
		parse: (value) => (Array.isArray(value) ? VaultList.ticks(value) : undefined),
		serialize: (value) => Object.keys(value).filter((id) => value[id]),
	});
	readonly foundForm = form(this.found);

	/** Positions are spoilers: shown once asked for, for the rest of the visit. */
	readonly positions = signal({ show: false });
	readonly positionsForm = form(this.positions);

	/** The active save has vault data, so the vault states come from it. */
	readonly saveActive = computed(() => !!this.saveVaults() && !!this.zones());

	/** Every vault: from the active save when it has vault data, else from the game data. */
	readonly entries: Signal<VaultEntry[]> = computed(() => {
		const save = this.saveVaults();
		const zones = this.zones();
		if (!save || !zones) {
			return VaultMatcher.entries(VaultList.DATA);
		}
		const sectors = new Set((this.activeSave.map()?.sectors ?? []).map((x) => x.id));
		return VaultMatcher.merge(VaultList.DATA, save, sectors, zones);
	});

	/** The vaults placed in a sector. */
	inSector(id: string): VaultEntry[] {
		return this.entries().filter((x) => x.sector === id);
	}

	/** Whether the player has the vault: opened in the save when it can tell, else ticked. */
	isDone(entry: VaultEntry): boolean {
		return entry.save?.opened ?? !!this.found()[entry.id];
	}

	private static ticks(ids: unknown[]): Record<string, boolean> {
		return Object.fromEntries(VaultList.DATA.map((x) => [x.id, ids.includes(x.id)]));
	}
}
