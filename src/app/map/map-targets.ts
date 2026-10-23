/** What a pointer event on a map points at, from the `data-*` attributes of the drawn elements. */
export class MapTargets {
	/** The id of the sector under the event target, from the closest `data-sector` element. */
	static sectorId(event: Event): string | undefined {
		const target = event.target as Element | null;
		return target?.closest?.('[data-sector]')?.getAttribute('data-sector') ?? undefined;
	}
}
