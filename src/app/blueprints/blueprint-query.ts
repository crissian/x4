import type { ParamMap, Params } from '@angular/router';
import { BlueprintCategories } from './blueprint-categories';

export type BlueprintTab = 'progress' | 'shopping';

/** The sub-tabs of the shopping list. */
export type ShoppingSection = 'buy' | 'reputation' | 'unsold';

/** The filter form of the blueprints page. */
export interface BlueprintsModel {
	/** a `BlueprintCategory` id or a `BlueprintKind`; empty for all */
	category: string;
	/** part of an item name */
	search: string;
	/** hide the categories the player owns every blueprint of */
	hideComplete: boolean;
	/** shopping list: a faction id, only what it sells; empty for all */
	faction: string;
	/** shopping list: only what the money in the save pays for */
	affordable: boolean;
}

/** The tab, shopping list section and filters of the blueprints page. */
export interface BlueprintsState {
	model: BlueprintsModel;
	tab: BlueprintTab;
	section: ShoppingSection;
}

/** Reads the blueprints page's tab and filters from the URL query params and writes them back, defaults left out. */
export class BlueprintQuery {
	static readonly DEFAULTS: Readonly<BlueprintsModel> = {
		category: '',
		search: '',
		hideComplete: false,
		faction: '',
		affordable: false,
	};
	static readonly DEFAULT_TAB: BlueprintTab = 'progress';
	static readonly DEFAULT_SECTION: ShoppingSection = 'buy';
	private static readonly SECTIONS: readonly ShoppingSection[] = ['buy', 'reputation', 'unsold'];

	static read(params: ParamMap): BlueprintsState {
		const category = params.get('category') ?? '';
		const section = params.get('list') as ShoppingSection;
		return {
			model: {
				category: BlueprintCategories.isFilter(category) ? category : '',
				search: params.get('q') ?? '',
				hideComplete: params.get('complete') === 'hide',
				faction: params.get('faction') ?? '',
				affordable: params.get('afford') === '1',
			},
			tab: params.get('tab') === 'shopping' ? 'shopping' : BlueprintQuery.DEFAULT_TAB,
			section: BlueprintQuery.SECTIONS.includes(section) ? section : BlueprintQuery.DEFAULT_SECTION,
		};
	}

	/** Every param, null for a default (so a merge removes it). */
	static write({ model, tab, section }: BlueprintsState): Params {
		const search = model.search.trim();
		return {
			tab: tab === BlueprintQuery.DEFAULT_TAB ? null : tab,
			list: section === BlueprintQuery.DEFAULT_SECTION ? null : section,
			category: model.category || null,
			q: search || null,
			complete: model.hideComplete ? 'hide' : null,
			faction: model.faction || null,
			afford: model.affordable ? '1' : null,
		};
	}
}
