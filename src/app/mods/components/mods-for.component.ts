import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { EquipmentModService } from '../../shared/services/equipment-mod.service';
import type { EquipmentMod, ModSlot } from '../../shared/services/model/equipment-mod';
import { ModColumns } from '../mod-columns';

/** A "Mods for this" card on a detail page: the mods that fit, with a link to the mods page of their slot. */
@Component({
	selector: 'app-mods-for',
	imports: [DataGridComponent, RouterLink],
	templateUrl: './mods-for.component.html',
})
export class ModsForComponent {
	readonly mods = input.required<readonly EquipmentMod[]>();
	readonly slot = input.required<ModSlot>();

	protected readonly columns = ModColumns.of(inject(EquipmentModService), { slot: false });
}
