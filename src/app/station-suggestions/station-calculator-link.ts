import type { Params } from '@angular/router';
import * as urlon from 'urlon';
import type { ModuleRow } from '../station/components/station-calculator.model';

/**
 * Query params that open the station calculator with a layout, as its share link does (`?l=`, urlon with `=` and
 * `&` swapped for URL-safe characters; read back by `StationCalculatorComponent.parseSharedLayout`).
 */
export class StationCalculatorLink {
	static readonly PATH = '/station-calculator';

	static params(rows: readonly ModuleRow[]): Params {
		const data = rows.filter((x) => x.count > 0 && x.moduleId).map((x) => ({ module: x.moduleId, count: x.count }));
		return { l: urlon.stringify(data).replace(/=/g, '-').replace(/&/g, ',') };
	}
}
