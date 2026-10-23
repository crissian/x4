import type { ParamMap, Params } from '@angular/router';
import { QueryParams } from '../shared/services/query-params';
import type { EmpireShipRow, EmpireStationRow } from './empire-model';

export type EmpireTab = 'ships' | 'stations';

/** The filter form of the empire page. */
export interface EmpireModel {
	/** part of a name, code, ship model or fleet */
	search: string;
	/** a sector id; empty for all */
	sector: string;
	/** ships: a size enum value; empty for all */
	size: string;
	/** ships: a purpose enum value; empty for all */
	role: string;
}

export interface EmpireState {
	tab: EmpireTab;
	model: EmpireModel;
}

/** Reads the empire page's tab and filters from the URL query params, writes them back, and applies the filters. */
export class EmpireQuery {
	static readonly TABS: readonly EmpireTab[] = ['ships', 'stations'];
	static readonly DEFAULTS: Readonly<EmpireModel> = { search: '', sector: '', size: '', role: '' };

	static read(params: ParamMap): EmpireState {
		return {
			tab: QueryParams.oneOf(params, 'tab', EmpireQuery.TABS, 'ships'),
			model: {
				search: params.get('q') ?? '',
				sector: params.get('sector') ?? '',
				size: params.get('size') ?? '',
				role: params.get('role') ?? '',
			},
		};
	}

	/** Every param, null for a default (so a merge removes it). */
	static write({ tab, model }: EmpireState): Params {
		return {
			tab: QueryParams.unlessDefault(tab, 'ships'),
			q: model.search.trim() || null,
			sector: model.sector || null,
			size: model.size || null,
			role: model.role || null,
		};
	}

	static ships(rows: readonly EmpireShipRow[], model: EmpireModel): EmpireShipRow[] {
		const search = model.search.trim().toLowerCase();
		return rows.filter(
			(x) =>
				(!model.sector || x.sector === model.sector) &&
				(!model.size || x.size === model.size) &&
				(!model.role || x.purpose === model.role) &&
				(!search || [x.label, x.code, x.modelName, x.fleet].some((text) => text.toLowerCase().includes(search)))
		);
	}

	static stations(rows: readonly EmpireStationRow[], model: EmpireModel): EmpireStationRow[] {
		const search = model.search.trim().toLowerCase();
		return rows.filter(
			(x) =>
				(!model.sector || x.sector === model.sector) &&
				(!search ||
					[x.name, x.code, ...x.products].some((text) => text.toLowerCase().includes(search)))
		);
	}
}
