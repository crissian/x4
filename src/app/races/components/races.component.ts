import { Component, inject } from '@angular/core';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { RowNavigation } from '../../shared/components/list-page';
import { Race } from '../../shared/services/model/model';
import { RaceService } from '../../shared/services/race.service';

@Component({
	imports: [DataGridComponent],
	templateUrl: './races.component.html',
})
export class RacesComponent {
	protected readonly entities = inject(RaceService).getEntities();
	protected readonly open = RowNavigation.inject<Race>();

	protected readonly columns: GridColumn<Race>[] = [
		{ key: 'name', caption: $localize`Name` },
		{ key: 'description', caption: $localize`Description` },
	];
}
