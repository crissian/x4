import { Component, computed, inject, input } from '@angular/core';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { RouterLink } from '@angular/router';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { FactionService } from '../../shared/services/faction.service';
import { relationToReputation } from '../../shared/services/loadout';
import { License } from '../../shared/services/model/model';

@Component({
	imports: [DetailPageComponent, DetailComponent, RouterLink, DataGridComponent],
	templateUrl: './faction-detail.component.html',
})
export class FactionDetailComponent {
	private readonly service = inject(FactionService);

	readonly id = input.required<string>();
	protected readonly entity = computed(() => this.service.getEntity(this.id()));

	protected readonly licenseColumns: GridColumn<License>[] = [
		{ key: 'name', caption: 'Name' },
		{ key: 'price', caption: 'Price', type: 'number' },
		{
			key: 'minRelation',
			caption: 'Reputation',
			type: 'number',
			value: (x) => (x.minRelation != null ? relationToReputation(x.minRelation) : null),
		},
	];
}
