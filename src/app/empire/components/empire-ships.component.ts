import { Component, inject } from '@angular/core';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { SectorMapLinkComponent } from '../../shared/components/sector-map-link.component';
import type { EmpireShipRow } from '../empire-model';
import { EmpireStore } from '../empire-store';
import { EmpireColumns } from './empire-columns';

/** The player's ships in fleet order: each commander followed by its subordinates, indented. */
@Component({
	selector: 'app-empire-ships',
	imports: [DataGridComponent, SectorMapLinkComponent],
	templateUrl: './empire-ships.component.html',
})
export class EmpireShipsComponent {
	protected readonly store = inject(EmpireStore);
	protected readonly columns = EmpireColumns.ships();
	protected readonly trackBy = (row: EmpireShipRow) => row.id;
}
