import type { ParamMap, Params } from '@angular/router';

export type ResearchView = 'tree' | 'list';

/** The filter form of the research page. */
export interface ResearchModel {
	/** part of a project name, or of the name of something it unlocks */
	search: string;
	/** show the projects the headquarters doesn't list */
	hidden: boolean;
}

/** The view, filters and selected project of the research page. */
export interface ResearchPageState {
	model: ResearchModel;
	view: ResearchView;
	/** the selected project id; empty for none */
	id: string;
}

/** Reads the research page's state from the URL query params and writes it back, defaults left out. */
export class ResearchQuery {
	static readonly DEFAULTS: Readonly<ResearchModel> = { search: '', hidden: false };

	/** @param known whether an id names a research project */
	static read(params: ParamMap, known: (id: string) => boolean): ResearchPageState {
		const id = params.get('id') ?? '';
		return {
			model: { search: params.get('q') ?? '', hidden: params.get('hidden') === '1' },
			view: params.get('view') === 'list' ? 'list' : 'tree',
			id: known(id) ? id : '',
		};
	}

	/** Every param, null for a default (so a merge removes it). */
	static write({ model, view, id }: ResearchPageState): Params {
		return {
			view: view === 'tree' ? null : view,
			q: model.search.trim() || null,
			hidden: model.hidden ? '1' : null,
			id: id || null,
		};
	}
}
