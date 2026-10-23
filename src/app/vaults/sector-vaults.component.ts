import { Component, computed, inject, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { ShowOnMapLinkComponent } from '../shared/components/show-on-map-link.component';
import { VaultGroups } from './vault-groups';
import { VaultList } from './vault-list';
import { VaultTableComponent } from './vault-table.component';

/** The data vaults of a sector, for its detail page; nothing when it has none. */
@Component({
	selector: 'app-sector-vaults',
	imports: [FormField, ShowOnMapLinkComponent, VaultTableComponent],
	templateUrl: './sector-vaults.component.html',
})
export class SectorVaultsComponent {
	protected readonly vaults = inject(VaultList);

	readonly sector = input.required<string>();

	protected readonly groups = computed(() => {
		const entries = this.vaults.inSector(this.sector());
		return entries.length ? [{ key: this.sector(), entries }] : [];
	});
	protected readonly progress = computed(() =>
		VaultGroups.progress(this.groups()[0]?.entries ?? [], (x) => this.vaults.isDone(x))
	);
}
