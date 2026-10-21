import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataGridComponent, GridColumn } from '../../shared/components/data-grid/data-grid.component';
import { injectRowNavigation } from '../../shared/components/list-page';
import { FactionService } from '../../shared/services/faction.service';
import { Sector } from '../../shared/services/model/model';
import { ClusterService, GAME_VERSIONS, SectorService } from '../../shared/services/universe.service';
import { WareService } from '../../shared/services/ware.service';

const percent: Intl.NumberFormatOptions = { style: 'percent', maximumFractionDigits: 0 };

@Component({
	imports: [DataGridComponent, RouterLink],
	templateUrl: './sectors.component.html',
})
export class SectorsComponent {
	private readonly clusters = inject(ClusterService);
	private readonly wares = inject(WareService);

	protected readonly entities = inject(SectorService).getEntities();
	protected readonly open = injectRowNavigation<Sector>();

	protected readonly columns: GridColumn<Sector>[] = [
		{ key: 'name', caption: 'Name' },
		{ key: 'cluster', caption: 'System', value: (x) => this.clusters.getEntity(x.cluster)?.name },
		{
			key: 'owner',
			caption: 'Owner',
			lookup: inject(FactionService)
				.getEntities()
				.filter((f) => this.entities.some((s) => s.owner === f.id))
				.map((f) => ({ value: f.id, label: f.name })),
		},
		{ key: 'sunlight', caption: 'Sunlight', type: 'number', format: percent },
		{ key: 'security', caption: 'Security', type: 'number', format: percent },
		{ key: 'economy', caption: 'Economy', type: 'number', format: percent },
		{
			key: 'resources',
			caption: 'Resources',
			value: (x) => [...new Set(x.resources.map((r) => this.wares.getEntity(r.ware)?.name ?? r.ware))].join(', '),
			sortable: false,
		},
		{ key: 'gates', caption: 'Gates', type: 'number', value: (x) => x.gates.length },
		{ key: 'version', caption: 'DLC', lookup: GAME_VERSIONS.map((label, value) => ({ value, label })) },
	];
}
