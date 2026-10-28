import { PlacementScorer } from '../../economy/placement-scorer';
import type { GridColumn, GridDot } from '../../shared/components/data-grid/data-grid.component';
import type { StationSuggestionRow } from '../station-suggestions-row';
import { StationSuggestionTexts } from '../station-suggestions-row';
import { Duration } from '../../core/format/duration';
import { NumberFormats } from '../../core/format/number-formats';

/**
 * The columns of the station suggestions table: ware, sector, Cr/h, payback, sunlight and the modules to build shown,
 * the rest in the column chooser. The rows come ranked by their score (see `PlacementScorer.spot`), which has no
 * column of its own; the inputs (buying) or resources (closed loop) and the sunlight are part of it, the security not.
 */
export class StationSuggestionsColumns {
	static all(ware: (id: string) => string, closed: boolean): GridColumn<StationSuggestionRow>[] {
		const { WHOLE } = NumberFormats;
		return [
			// TODO(hideable): merge item; the ware and the sector are never hidden (`hideable: false`, set below)
			{
				key: 'name',
				caption: $localize`Ware`,
				hideable: false,
				link: (x) => ['/wares', x.ware],
				title: (x) => (x.building ? $localize`Ship and station building is not counted` : undefined),
			},
			{ key: 'sectorName', caption: $localize`Sector`, hideable: false, link: (x) => ['/sectors', x.sector] },
			{
				key: 'crPerHour',
				caption: $localize`Expected Cr/h`,
				type: 'number',
				format: WHOLE,
				title: () =>
					closed
						? $localize`What the modules sell at the average price; the reach caps it`
						: $localize`What the modules sell at the average price less the inputs; the reach caps it`,
			},
			{
				key: 'payback',
				caption: $localize`Payback`,
				type: 'number',
				display: (x) => StationSuggestionsColumns.hours(x.payback),
				title: (x) =>
					$localize`Build cost of about ${NumberFormats.whole(x.buildCost)}:cost: Cr at average prices, production modules only`,
			},
			{
				key: 'sunlight',
				caption: $localize`Sunlight`,
				type: 'number',
				display: (x) => NumberFormats.percent(x.sunlight),
				title: (x) =>
					x.efficiency < 1
						? $localize`A module here pays back at ${NumberFormats.percent(x.efficiency)}:efficiency: of the speed of one at 100% sunlight; the ranking is multiplied by it`
						: undefined,
			},
			{
				key: 'modules',
				// never below 1: spots without room for one module are not listed
				caption: $localize`Modules to build`,
				type: 'number',
				format: WHOLE,
				title: (x) =>
					$localize`Production modules of ${NumberFormats.whole(x.moduleOutput)}:output:/h each that the ${NumberFormats.whole(x.absorbable)}:absorbable:/h the reach absorbs keeps busy, rounded down`,
			},
			{
				key: 'buildCost',
				caption: $localize`Build cost`,
				type: 'number',
				format: WHOLE,
				hidden: true,
			},
			{
				key: 'absorbable',
				caption: $localize`Absorbable/h`,
				type: 'number',
				format: WHOLE,
				hidden: true,
			},
			closed ? StationSuggestionsColumns.resources(ware) : StationSuggestionsColumns.inputs(ware),
			{
				key: 'security',
				caption: $localize`Security`,
				type: 'number',
				value: (x) => x.security,
				display: (x) => (x.security === undefined ? '' : NumberFormats.percent(x.security)),
				hidden: true,
			},
			{ key: 'contributors', caption: $localize`Top demand (jumps)`, hidden: true },
		];
	}

	/** Green with everything in reach, amber with some, red with none; no dot without any. */
	static dot(row: StationSuggestionRow, count: number): GridDot | undefined {
		if (!count) {
			return undefined;
		}
		if (row.coverage >= 1) {
			return { tone: 'green', level: 2 };
		}
		return row.coverage > 0 ? { tone: 'amber', level: 2 } : { tone: 'red', level: 2 };
	}

	/** Hours as hours and minutes; empty when it never pays back. */
	static hours(hours: number): string {
		return Number.isFinite(hours) ? Duration.hoursMinutes(hours * 3600) : '';
	}

	private static factor(row: StationSuggestionRow): string {
		const value = NumberFormats.format(PlacementScorer.factor(row.coverage), { maximumFractionDigits: 2 });
		return $localize`Factor ×${value}:factor: (0.5 + 0.5 × coverage) on the ranking`;
	}

	private static inputs(ware: (id: string) => string): GridColumn<StationSuggestionRow> {
		return {
			key: 'inputs',
			caption: $localize`Inputs`,
			value: (x) => StationSuggestionTexts.inputs(x.inputs),
			sortValue: (x) => x.coverage,
			dot: (x) => StationSuggestionsColumns.dot(x, x.inputs.length),
			title: (x) =>
				x.inputs.length
					? [
							StationSuggestionsColumns.factor(x),
							StationSuggestionTexts.inputsTitle(
								x.inputs,
								ware,
								(value) => $localize`${NumberFormats.signedWhole(value)}:value: per hour`
							),
						].join('\n')
					: undefined,
			hidden: true,
		};
	}

	private static resources(ware: (id: string) => string): GridColumn<StationSuggestionRow> {
		return {
			key: 'resources',
			caption: $localize`Resources`,
			value: (x) => StationSuggestionTexts.resources(x.resources),
			sortValue: (x) => x.coverage,
			dot: (x) => StationSuggestionsColumns.dot(x, x.resources.length),
			title: (x) =>
				x.resources.length
					? [
							StationSuggestionsColumns.factor(x),
							StationSuggestionTexts.resourcesTitle(x.resources, ware),
						].join('\n')
					: undefined,
			hidden: true,
		};
	}
}
