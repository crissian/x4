import { Component, inject } from '@angular/core';
import { DetailComponent, DetailPageComponent } from '../../shared/components/detail-page.component';
import { EntityDetailPage } from '../../shared/components/entity-detail-page';
import { EntityLinkComponent } from '../../shared/components/entity-link.component';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { FactionService } from '../../shared/services/faction.service';
import { Loadouts } from '../../shared/services/loadout';
import { Faction, License } from '../../shared/services/model/model';

@Component({
	imports: [DetailPageComponent, DetailComponent, EntityLinkComponent, DataGridComponent],
	templateUrl: './faction-detail.component.html',
})
export class FactionDetailComponent extends EntityDetailPage<Faction> {
	protected readonly service = inject(FactionService);

	protected readonly licenseColumns: GridColumn<License>[] = [
		{ key: 'name', caption: $localize`Name` },
		{ key: 'price', caption: $localize`Price`, type: 'number' },
		{
			key: 'minRelation',
			caption: $localize`Reputation`,
			type: 'number',
			value: (x) => (x.minRelation != null ? Loadouts.relationToReputation(x.minRelation) : null),
		},
	];
}
