import { Component, inject } from '@angular/core';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { SectorMapLinkComponent } from '../../shared/components/sector-map-link.component';
import type { EmpireStationRow } from '../empire-model';
import { EmpireStore } from '../empire-store';
import { EmpireColumns } from './empire-columns';
import { StationCalculatorLinkComponent } from './station-calculator-link.component';

/** The player's stations with their modules, products, storage and money. */
@Component({
	selector: 'app-empire-stations',
	imports: [DataGridComponent, SectorMapLinkComponent, StationCalculatorLinkComponent],
	templateUrl: './empire-stations.component.html',
})
export class EmpireStationsComponent {
	protected readonly store = inject(EmpireStore);
	protected readonly columns = EmpireColumns.stations();
	protected readonly trackBy = (row: EmpireStationRow) => row.id;
}
