import { Injectable } from '@angular/core';
import { Factions } from './data/factions-data';
import { EntityStore } from './entity.service';
import { Faction, License } from './model/model';

/** A faction selling an item and the license it asks for. */
export interface LicenseRequirement {
	faction: Faction;
	license?: License;
}

@Injectable({ providedIn: 'root' })
export class FactionService extends EntityStore<Faction> {
	constructor() {
		super(Factions.all as Faction[]);
	}

	/** Factions selling the item and the license each one asks for. */
	sellers(owners: readonly Faction[] | undefined, license: string | undefined): LicenseRequirement[] {
		return (owners ?? [])
			.map((owner) => this.getEntity(owner.id) ?? owner)
			.map((faction) => ({
				faction,
				license: license ? faction.licenses?.find((x) => x.type === license) : undefined,
			}));
	}
}
