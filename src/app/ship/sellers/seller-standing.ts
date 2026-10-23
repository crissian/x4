import type { SaveLicences, SaveRelations } from '../../savegame/map/save-map-model';
import { Loadouts } from '../../shared/services/loadout';
import type { LicenseRequirement } from '../../shared/services/ship-stats.service';

/**
 * - ok: the player can buy it now
 * - reputation: the relation is below the licence's minimum
 * - ceremony: the reputation is enough but the licence ceremony is still missing
 * - enemy: the faction is hostile; its stations won't let the player dock
 * - unknown: no save, only the requirement is known
 */
export type StandingStatus = 'ok' | 'reputation' | 'ceremony' | 'enemy' | 'unknown';

export interface Standing {
	status: StandingStatus;
	/** reputation points the licence needs */
	needed?: number;
	/** the player's reputation points */
	have?: number;
	/** points still missing, at least 1 */
	missing?: number;
}

/** Whether the player's relation and licences (from a save) let them buy from a faction. */
export class SellerStanding {
	/** The same hostility rule as the trade routes: relation -0.01 or lower. */
	static readonly ENEMY = -0.01;

	/** `licences` missing (a save read before licences were extracted) falls back to the reputation check. */
	static of(requirement: LicenseRequirement, relations?: SaveRelations, licences?: SaveLicences): Standing {
		const min = requirement.license?.minRelation;
		const needed = min != null ? Loadouts.relationToReputation(min) : undefined;
		if (!relations) {
			return { status: 'unknown', needed };
		}
		const relation = relations[requirement.faction.id] ?? 0;
		const have = Loadouts.relationToReputation(relation);
		if (relation <= SellerStanding.ENEMY) {
			return { status: 'enemy', needed, have };
		}
		if (min == null) {
			return { status: 'ok', have };
		}
		if (relation < min) {
			return { status: 'reputation', needed, have, missing: Math.max(1, needed! - have) };
		}
		// Licences that need a positive relation are the ones with a ceremony precursor in factions.xml (minrelation
		// 0.01 or 0.1); the basic ones (-0.01) are granted without one.
		const type = requirement.license!.type;
		if (licences && min > 0 && !licences[type]?.includes(requirement.faction.id)) {
			return { status: 'ceremony', needed, have };
		}
		return { status: 'ok', needed, have };
	}
}
