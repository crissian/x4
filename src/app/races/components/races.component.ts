import { Component, inject } from '@angular/core';
import { GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { ListPageComponent } from '../../shared/components/list-page.component';
import { Race } from '../../shared/services/model/model';
import { RaceService } from '../../shared/services/race.service';

@Component({
	imports: [ListPageComponent],
	templateUrl: './races.component.html',
})
export class RacesComponent {
	protected readonly entities = inject(RaceService).getEntities();

	protected readonly columns: GridColumn<Race>[] = [
		{ key: 'name', caption: $localize`Name` },
		{ key: 'description', caption: $localize`Description` },
	];
}
