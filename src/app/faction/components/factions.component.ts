import { Component, inject } from '@angular/core';
import { GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { ListPageComponent } from '../../shared/components/list-page.component';
import { FactionService } from '../../shared/services/faction.service';
import { Faction } from '../../shared/services/model/model';

@Component({
	imports: [ListPageComponent],
	templateUrl: './factions.component.html',
})
export class FactionsComponent {
	protected readonly entities = inject(FactionService).getEntities();

	protected readonly columns: GridColumn<Faction>[] = [
		{ key: 'name', caption: $localize`Name` },
		{ key: 'description', caption: $localize`Description` },
	];
}
