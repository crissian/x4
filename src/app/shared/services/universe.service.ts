import { Injectable } from '@angular/core';
import { Clusters } from './data/clusters-data';
import { Sectors } from './data/sectors-data';
import { EntityStore } from './entity.service';
import { Cluster, Sector } from './model/model';

@Injectable({ providedIn: 'root' })
export class ClusterService extends EntityStore<Cluster> {
	constructor() {
		super(Clusters.all as Cluster[]);
	}
}

@Injectable({ providedIn: 'root' })
export class SectorService extends EntityStore<Sector> {
	constructor() {
		super(Sectors.all as Sector[]);
	}
}
