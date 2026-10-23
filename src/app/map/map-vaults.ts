import { Injectable, computed, inject } from '@angular/core';
import { form } from '@angular/forms/signals';
import { LocalStorage } from '../core/services/local-storage';
import { VaultEntry } from '../vaults/data-vault';
import { VaultGroups } from '../vaults/vault-groups';
import { VaultList } from '../vaults/vault-list';
import { GalaxyLayout } from './galaxy-layout';
import { MapStore } from './map-store';

/** The data vault layer of the galaxy map and its side panel. Provided by the map page. */
@Injectable()
export class MapVaults {
	private readonly store = inject(MapStore);
	readonly vaults = inject(VaultList);

	/** The layer is a spoiler: off until shown, then remembered. */
	readonly layer = LocalStorage.persistedSignal(
		'map-vaults',
		{ show: false },
		{
			parse: (value) =>
				typeof (value as { show?: unknown })?.show === 'boolean' ? (value as { show: boolean }) : undefined,
		}
	);
	readonly layerForm = form(this.layer);

	/** The vaults of the drawn sectors, plus the randomly placed ones of the shown content packs; without a save. */
	readonly entries = computed(() => {
		const drawn = this.store.drawnIds();
		const saveActive = this.vaults.saveActive();
		return this.vaults
			.entries()
			.filter((x) => (x.sector ? drawn.has(x.sector) : true) && (saveActive || this.store.isShown(x.version)));
	});
	readonly groups = computed(() =>
		VaultGroups.bySector(this.entries(), (id) => this.store.shapeById.get(id)?.sector)
	);
	readonly progress = computed(() => VaultGroups.progress(this.entries(), (x) => this.vaults.isDone(x)));

	/**
	 * Map markers: at their spot once positions are shown, else in a row at the sector center, which tells only the
	 * sector.
	 */
	readonly markers = computed(() => {
		if (!this.layer().show) {
			return [];
		}
		const exact = this.vaults.positions().show;
		return this.groups().flatMap((group) => {
			const shape = group.sector ? this.store.shapeById.get(group.sector.id) : undefined;
			if (!shape) {
				return [];
			}
			return group.entries.map((entry, i) => {
				const spot =
					exact && entry.x != null ? entry : { x: (i - (group.entries.length - 1) / 2) * 40, z: -60 };
				return {
					entry,
					shape,
					done: this.vaults.isDone(entry),
					...GalaxyLayout.markerPosition(shape, spot.x ?? 0, spot.z ?? 0),
				};
			});
		});
	});

	/** The marker tooltip: what the vault holds. */
	title(entry: VaultEntry): string {
		return entry.name ?? entry.blueprints.map((x) => x.name ?? x.id).join(', ');
	}
}
