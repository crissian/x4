import type { Params } from '@angular/router';
import * as urlon from 'urlon';
import type { ModuleRow } from './components/station-calculator.model';

/**
 * The station calculator's share link: `?l=` holds the layout (urlon with `=` and `&` swapped for URL-safe
 * characters), and the optional `?sun=` the sunlight in percent the layout was sized for.
 */
export class StationLayoutLink {
	static readonly PATH = '/station-calculator';

	/**
	 * The query params of a layout.
	 * @param sunlight in percent; left out when not given
	 */
	static params(rows: readonly ModuleRow[], sunlight?: number): Params {
		const data = rows.filter((x) => x.count > 0 && x.moduleId).map((x) => ({ module: x.moduleId, count: x.count }));
		const params: Params = { l: urlon.stringify(data).replace(/=/g, '-').replace(/&/g, ',') };
		if (sunlight !== undefined) {
			params['sun'] = Math.round(sunlight);
		}
		return params;
	}

	/** The rows of the `l` param; undefined when missing or unreadable. */
	static parse(value: string | undefined): ModuleRow[] | undefined {
		if (!value) {
			return undefined;
		}
		try {
			const layoutData = urlon.parse(value.replace(/-/g, '=').replace(/,/g, '&')) as {
				module: string;
				count: number;
			}[];
			return layoutData.map((x) => ({ moduleId: x.module, count: x.count }));
		} catch (err) {
			console.log(err);
			return undefined;
		}
	}

	/** The sunlight in percent of the `sun` param: a number of 0 or more, else undefined. */
	static parseSunlight(value: string | undefined): number | undefined {
		const sunlight = value ? Number(value) : NaN;
		return Number.isFinite(sunlight) && sunlight >= 0 ? sunlight : undefined;
	}
}
