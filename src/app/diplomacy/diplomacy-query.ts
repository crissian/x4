import type { ParamMap, Params } from '@angular/router';
import type { SaveDiplomacy } from '../savegame/extractors/diplomacy-extractor';
import type { DiplomacyAction } from '../shared/services/model/diplomacy';
import { QueryParams } from '../shared/services/query-params';

/** The tabs of the diplomacy page. */
export type DiplomacyTab = 'actions' | 'events' | 'gifts' | 'agents';

/** The action filters of the diplomacy page; empty values match every action. */
export interface DiplomacyModel {
	category: string;
	agentType: string;
	risk: string;
	/** part of an action's name or short description */
	search: string;
	/** only the actions the menu of the active save shows */
	shown: boolean;
}

/** The state of the diplomacy page kept in the URL. */
export interface DiplomacyState {
	tab: DiplomacyTab;
	model: DiplomacyModel;
}

/** The ids the filters accept. */
export interface DiplomacyIds {
	categories: readonly string[];
	agentTypes: readonly string[];
	risks: readonly string[];
}

/** Reads the diplomacy page state from the URL query params and writes it back, and applies the filters. */
export class DiplomacyQuery {
	static readonly TABS: readonly DiplomacyTab[] = ['actions', 'events', 'gifts', 'agents'];

	static read(params: ParamMap, ids: DiplomacyIds): DiplomacyState {
		return {
			tab: QueryParams.oneOf(params, 'tab', DiplomacyQuery.TABS, 'actions'),
			model: {
				category: QueryParams.oneOf(params, 'category', ids.categories, ''),
				agentType: QueryParams.oneOf(params, 'agent', ids.agentTypes, ''),
				risk: QueryParams.oneOf(params, 'risk', ids.risks, ''),
				search: params.get('q') ?? '',
				shown: QueryParams.flag(params, 'shown'),
			},
		};
	}

	/** Every param, null for a default (so a merge removes it). */
	static write({ tab, model }: DiplomacyState): Params {
		return {
			tab: QueryParams.unlessDefault(tab, 'actions'),
			category: model.category || null,
			agent: model.agentType || null,
			risk: model.risk || null,
			q: model.search.trim() || null,
			shown: QueryParams.writeFlag(model.shown),
		};
	}

	/** The actions the filters leave; `shown` only applies with the diplomacy of a save. */
	static apply(actions: readonly DiplomacyAction[], model: DiplomacyModel, save?: SaveDiplomacy): DiplomacyAction[] {
		const search = model.search.trim().toLowerCase();
		const shown = model.shown && save?.found ? save.actions : undefined;
		return actions.filter(
			(x) =>
				(!model.category || x.category === model.category) &&
				(!model.agentType || x.agentType === model.agentType) &&
				(!model.risk || x.risk === model.risk) &&
				(!shown || shown[x.id] === true) &&
				(!search || x.name.toLowerCase().includes(search) || x.shortDescription.toLowerCase().includes(search))
		);
	}
}
