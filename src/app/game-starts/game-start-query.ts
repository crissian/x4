import type { ParamMap, Params } from '@angular/router';
import { QueryParams } from '../shared/services/query-params';
import { GameStartTypes, type GameStartTypeFilter } from './game-start-types';

export type GameStartView = 'cards' | 'table';

/** The filter form of the game starts page. */
export interface GameStartsModel {
	type: GameStartTypeFilter;
	search: string;
	view: GameStartView;
}

/** Reads the game starts page's filters from the URL query params and writes them back, defaults left out. */
export class GameStartQuery {
	static readonly DEFAULTS: Readonly<GameStartsModel> = { type: '', search: '', view: 'cards' };
	static readonly VIEWS: readonly GameStartView[] = ['cards', 'table'];

	static read(params: ParamMap): GameStartsModel {
		const type = params.get('type') ?? '';
		return {
			type: GameStartTypes.isFilter(type) ? type : '',
			search: params.get('q') ?? '',
			view: QueryParams.oneOf(params, 'view', GameStartQuery.VIEWS, 'cards'),
		};
	}

	/** Every param, null for a default (so a merge removes it). */
	static write(model: GameStartsModel): Params {
		const search = model.search.trim();
		return {
			type: model.type || null,
			q: search || null,
			view: QueryParams.unlessDefault(model.view, 'cards'),
		};
	}
}
