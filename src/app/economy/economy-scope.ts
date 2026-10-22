import type { EconomyScope, StationFlows } from './economy-model';
import type { SectorGraph } from './sector-graph';

/** Picks the stations a scope covers. */
export class EconomyScopes {
	static readonly DEFAULT_JUMPS = 3;
	static readonly PLAYER = 'player';

	static stations(all: readonly StationFlows[], scope: EconomyScope, graph: SectorGraph): StationFlows[] {
		const near = scope.centre
			? new Set(graph.within(scope.centre, scope.jumps ?? EconomyScopes.DEFAULT_JUMPS))
			: undefined;
		return all.filter(
			(x) =>
				(scope.includePlayer !== false || x.station.owner !== EconomyScopes.PLAYER) &&
				(!scope.faction || x.station.owner === scope.faction) &&
				(!near || near.has(x.station.sector))
		);
	}
}
