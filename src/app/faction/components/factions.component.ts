import { Component, inject } from '@angular/core';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { RowNavigation } from '../../shared/components/list-page';
import { FactionService } from '../../shared/services/faction.service';
import { Faction } from '../../shared/services/model/model';

@Component({
	imports: [DataGridComponent],
	templateUrl: './factions.component.html',
})
export class FactionsComponent {
	protected readonly entities = inject(FactionService).getEntities();
	protected readonly open = RowNavigation.inject<Faction>();

	protected readonly columns: GridColumn<Faction>[] = [
		{ key: 'name', caption: $localize`Name` },
		{ key: 'description', caption: $localize`Description` },
	];
}
