import { Injectable } from '@angular/core';
import { Clusters } from './data/clusters-data';
import { Sectors } from './data/sectors-data';
import { EntityService } from './entity.service';
import { Cluster, Sector } from './model/model';

/** Game content packs, indexed by the `version` of the generated entities. */
export const GAME_VERSIONS = [
	'Base game',
	'Split Vendetta',
	'Cradle of Humanity',
	'Tides of Avarice',
	'Kingdom End',
	'Timelines',
	'Hyperion Pack',
	'Envoy Pack',
];

@Injectable({ providedIn: 'root' })
export class ClusterService implements EntityService<Cluster> {
	getEntities(): Cluster[] {
		return Clusters.all as any[];
	}

	getEntity(id: any): Cluster {
		return (Clusters as any)[id];
	}
}

@Injectable({ providedIn: 'root' })
export class SectorService implements EntityService<Sector> {
	getEntities(): Sector[] {
		return Sectors.all as any[];
	}

	getEntity(id: any): Sector {
		return (Sectors as any)[id];
	}
}
