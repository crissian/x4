import type { ParamMap, Params } from '@angular/router';
import { QueryParams } from '../shared/services/query-params';

export type TerraformingView = 'list' | 'graph';

/** The form of the terraforming page. */
export interface TerraformingModel {
	/** the cluster id of the picked planet */
	planet: string;
}

export interface TerraformingPageState {
	model: TerraformingModel;
	view: TerraformingView;
}

/** Reads the terraforming page's state from the URL query params and writes it back, defaults left out. */
export class TerraformingQuery {
	static readonly VIEWS: readonly TerraformingView[] = ['list', 'graph'];

	/** @param planets the cluster ids of the planets; the first is the default */
	static read(params: ParamMap, planets: readonly string[]): TerraformingPageState {
		return {
			model: { planet: QueryParams.known(params, 'planet', (x) => planets.includes(x), planets[0] ?? '') },
			view: QueryParams.oneOf(params, 'view', TerraformingQuery.VIEWS, 'list'),
		};
	}

	static write({ model, view }: TerraformingPageState, planets: readonly string[]): Params {
		return {
			planet: QueryParams.unlessDefault(model.planet, planets[0] ?? ''),
			view: QueryParams.unlessDefault(view, 'list'),
		};
	}
}
