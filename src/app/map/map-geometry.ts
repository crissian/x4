import { Injectable, inject } from '@angular/core';
import { ClusterService, SectorService } from '../shared/services/universe.service';
import { GalaxyLayout } from './galaxy-layout';

/**
 * The laid out galaxy and its sector shapes. A separate injectable so both the map store and the save
 * layer can read the shapes without depending on each other. Provided by the map page.
 */
@Injectable()
export class MapGeometry {
	private readonly sectors = inject(SectorService);

	readonly layout = GalaxyLayout.of(inject(ClusterService).getEntities(), (id) => this.sectors.getEntity(id));
	readonly sectorList = this.layout.shapes.map((x) => x.sector).sort((a, b) => a.name.localeCompare(b.name));
	readonly shapeById = new Map(this.layout.shapes.map((x) => [x.sector.id, x]));
}
