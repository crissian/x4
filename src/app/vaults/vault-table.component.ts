import { DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { MapFocusLinkComponent } from '../map/panels/map-focus-link.component';
import { VaultGroup } from './vault-groups';
import { VaultList } from './vault-list';

/**
 * Vaults by sector: what each holds, whether the player has it (from the save, else a tick) and, once asked for,
 * where it is.
 */
@Component({
	selector: 'app-vault-table',
	imports: [DecimalPipe, FormField, RouterLink, MapFocusLinkComponent],
	templateUrl: './vault-table.component.html',
})
export class VaultTableComponent {
	protected readonly vaults = inject(VaultList);

	readonly groups = input.required<VaultGroup[]>();
	/** Sector headers that focus the sector on the galaxy map; off when the table lists a single sector. */
	readonly headers = input(true);
}
