import type { ParamMap, Params } from '@angular/router';
import type { AchievementCategory } from './achievement-model';
import { AchievementRows } from './achievement-rows';

/** The filter form of the achievements page. */
export interface AchievementsModel {
	search: string;
	category: AchievementCategory | '';
	/** a content pack version as text, empty for all */
	version: string;
	hideDone: boolean;
	spoilers: boolean;
}

/** Reads the achievements page's filters from the URL query params and writes them back, defaults left out. */
export class AchievementQuery {
	static readonly DEFAULTS: Readonly<AchievementsModel> = {
		search: '',
		category: '',
		version: '',
		hideDone: false,
		spoilers: false,
	};

	static read(params: ParamMap, versions: number): AchievementsModel {
		const category = params.get('category') ?? '';
		const version = Number(params.get('dlc') ?? '');
		return {
			search: params.get('q') ?? '',
			category: AchievementRows.isCategory(category) ? category : '',
			version:
				params.has('dlc') && Number.isInteger(version) && version >= 0 && version < versions
					? String(version)
					: '',
			hideDone: params.get('done') === 'hide',
			spoilers: params.get('spoilers') === '1',
		};
	}

	/** Every param, null for a default (so a merge removes it). */
	static write(model: AchievementsModel): Params {
		const search = model.search.trim();
		return {
			q: search || null,
			category: model.category || null,
			dlc: model.version || null,
			done: model.hideDone ? 'hide' : null,
			spoilers: model.spoilers ? '1' : null,
		};
	}
}
