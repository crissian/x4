import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { FactionService } from '../../shared/services/faction.service';
import { License } from '../../shared/services/model/model';

@Component({
	imports: [RouterLink, DataGridComponent],
	templateUrl: './faction-detail.component.html',
})
export class FactionDetailComponent {
	private readonly service = inject(FactionService);

	readonly id = input.required<string>();
	protected readonly entity = computed(() => this.service.getEntity(this.id()));

	protected readonly licenseColumns: GridColumn<License>[] = [
		{ key: 'name', caption: 'Name' },
		{ key: 'price', caption: 'Price', type: 'number' },
	];
}
