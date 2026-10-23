import { inject } from '@angular/core';
import { EnumLabels } from '../../../core/enum-labels';
import { FactionService } from '../../services/faction.service';
import { Faction } from '../../services/model/model';
import { RaceService } from '../../services/race.service';
import type { GridLookupItem } from './grid-column';

/** Filter values of data grid columns (a column's `lookup`). */
export class GridLookups {
	/** Plain string values, labelled with their enum labels. */
	static of(values: readonly string[]): GridLookupItem[] {
		return values.map((x) => ({ value: x, label: EnumLabels.label(x) }));
	}

	/** The values of a string enum, labelled with their enum labels. */
	static ofEnum(values: Record<string, string>): GridLookupItem[] {
		return GridLookups.of(Object.values(values));
	}

	/** Every race by id. Needs an injection context. */
	static races(): GridLookupItem[] {
		return inject(RaceService)
			.getEntities()
			.map((x) => ({ value: x.id, label: x.name }));
	}

	/** The factions by id, or only those `filter` keeps. Needs an injection context. */
	static factions(filter: (faction: Faction) => boolean = () => true): GridLookupItem[] {
		return inject(FactionService)
			.getEntities()
			.filter(filter)
			.map((x) => ({ value: x.id, label: x.name }));
	}
}
