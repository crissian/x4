import type { ParamMap, Params } from '@angular/router';
import { BlueprintCategories } from './blueprint-categories';

export type BlueprintTab = 'progress' | 'shopping';

/** The filter form of the blueprints page. */
export interface BlueprintsModel {
	/** a `BlueprintCategory` id; empty for all */
	category: string;
	/** part of an item name */
	search: string;
	/** hide the categories the player owns every blueprint of */
	hideComplete: boolean;
}

/** Reads the blueprints page's tab and filters from the URL query params and writes them back, defaults left out. */
export class BlueprintQuery {
	static readonly DEFAULTS: Readonly<BlueprintsModel> = { category: '', search: '', hideComplete: false };
	static readonly DEFAULT_TAB: BlueprintTab = 'progress';

	static read(params: ParamMap): BlueprintsModel {
		const category = params.get('category') ?? '';
		return {
			category: BlueprintCategories.get(category) ? category : '',
			search: params.get('q') ?? '',
			hideComplete: params.get('complete') === 'hide',
		};
	}

	static tab(params: ParamMap): BlueprintTab {
		return params.get('tab') === 'shopping' ? 'shopping' : BlueprintQuery.DEFAULT_TAB;
	}

	/** Every param, null for a default (so a merge removes it). */
	static write(model: BlueprintsModel, tab: BlueprintTab): Params {
		const search = model.search.trim();
		return {
			tab: tab === BlueprintQuery.DEFAULT_TAB ? null : tab,
			category: model.category || null,
			q: search || null,
			complete: model.hideComplete ? 'hide' : null,
		};
	}
}
