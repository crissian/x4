import { Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { VaultTableComponent } from '../../vaults/vault-table.component';
import { MapVaults } from '../map-vaults';

/** Data vaults by sector, with the layer toggle and the spoiler guard for their positions. */
@Component({
	selector: 'app-map-vaults-panel',
	imports: [FormField, RouterLink, VaultTableComponent],
	templateUrl: './map-vaults-panel.component.html',
})
export class MapVaultsPanelComponent {
	protected readonly map = inject(MapVaults);
}
