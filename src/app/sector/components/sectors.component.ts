import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMap } from '@lucide/angular';
import { GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { ListPageComponent } from '../../shared/components/list-page.component';
import { GridLookups } from '../../shared/components/data-grid/grid-lookups';
import { Sector } from '../../shared/services/model/model';
import { GAME_VERSION_LOOKUP } from '../../shared/services/constants';
import { ClusterService, SectorService } from '../../shared/services/universe.service';
import { WareService } from '../../shared/services/ware.service';
import { NumberFormats } from '../../core/format/number-formats';

@Component({
	imports: [ListPageComponent, RouterLink, LucideMap],
	templateUrl: './sectors.component.html',
})
export class SectorsComponent {
	private readonly clusters = inject(ClusterService);
	private readonly wares = inject(WareService);

	protected readonly entities = inject(SectorService).getEntities();

	protected readonly columns: GridColumn<Sector>[] = [
		{ key: 'name', caption: $localize`Name` },
		{ key: 'cluster', caption: $localize`System`, value: (x) => this.clusters.getEntity(x.cluster)?.name },
		{
			key: 'owner',
			caption: $localize`Owner`,
			lookup: GridLookups.factions((f) => this.entities.some((s) => s.owner === f.id)),
		},
		{ key: 'sunlight', caption: $localize`Sunlight`, type: 'number', format: NumberFormats.PERCENT },
		{ key: 'security', caption: $localize`Security`, type: 'number', format: NumberFormats.PERCENT },
		{ key: 'economy', caption: $localize`Economy`, type: 'number', format: NumberFormats.PERCENT },
		{
			key: 'resources',
			caption: $localize`Resources`,
			value: (x) => [...new Set(x.resources.map((r) => this.wares.getEntity(r.ware)?.name ?? r.ware))].join(', '),
			sortable: false,
		},
		{ key: 'gates', caption: $localize`Gates`, type: 'number', value: (x) => x.gates.length },
		{ key: 'version', caption: $localize`DLC`, lookup: GAME_VERSION_LOOKUP },
	];
}
