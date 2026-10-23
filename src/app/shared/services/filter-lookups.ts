import type { SectorService } from './universe.service';
import type { WareService } from './ware.service';

/**
 * The checks of the URL values that the filter forms share: sector ids and names, wares and ware groups. The members
 * are arrow functions, so a store can spread them into its own lookups.
 */
export class FilterLookups {
	constructor(
		private readonly sectorService: SectorService,
		private readonly wareService: WareService
	) {}

	/** A known ware id. */
	readonly ware = (id: string): boolean => !!id && !!this.wareService.getEntity(id);
	/** A known ware group id. */
	readonly group = (id: string): boolean => !!id && this.wareService.getEntities().some((x) => x.group?.id === id);
	/** The name of a sector id, undefined when unknown. */
	readonly sectorName = (id: string): string | undefined => this.sectorService.getEntity(id)?.name;
	/** The id of a sector name, whatever its case; undefined when unknown. */
	readonly sectorId = (name: string): string | undefined => {
		const key = name.trim().toLowerCase();
		return key ? this.sectorService.getEntities().find((x) => x.name.toLowerCase() === key)?.id : undefined;
	};
}
