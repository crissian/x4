import { Diagnoses } from '../../economy/diagnosis';
import type { GridColumn, GridGroup } from '../../shared/components/data-grid/data-grid.component';
import { SupplyDemandDiagnosis } from '../supply-demand-diagnosis';
import type { SupplyDemandRow } from '../supply-demand-model';
import { NumberFormats } from '../../core/format/number-formats';

/** The columns of the supply and demand table. */
export class SupplyDemandColumns {
	static readonly CAPACITY = 'capacity';
	static readonly MARKET = 'market';
	static readonly DIAGNOSIS = 'diagnosis';

	/** The two headers over the columns: what the stations are built for, and what is on offer now. */
	static groups(): GridGroup[] {
		return [
			{
				key: SupplyDemandColumns.CAPACITY,
				label: $localize`Built capacity / h`,
				hint: $localize`What stations are built to make and use per hour, with full inputs, their real workforce and sunlight. Stable; decides what is worth building.`,
				tone: 'teal',
			},
			{
				key: SupplyDemandColumns.DIAGNOSIS,
				label: $localize`Diagnosis (capacity × market)`,
				hint: $localize`Reads the built capacity and the market together.`,
			},
			{
				key: SupplyDemandColumns.MARKET,
				label: $localize`Market now`,
				hint: $localize`Open offers at save time. Changes within minutes; shows whether the capacity actually reaches the market.`,
				tone: 'amber',
			},
		];
	}

	private static readonly DASH = '—';

	/** Mined wares have no capacity numbers; the table says so in a title. */
	private static readonly MINING = $localize`Mining is not counted`;
	private static readonly BUILDING = $localize`Excludes ship and station building`;
	private static readonly PARTLY_BUILDING = $localize`Also used to build ships and stations; real demand is higher`;
	private static readonly BALANCE = $localize`Net as a share of the larger of produced and consumed: how much of the demand is unmet, or of the output unused`;

	static all(): GridColumn<SupplyDemandRow>[] {
		const { SIGNED_WHOLE: NET, WHOLE: PER_HOUR } = NumberFormats;
		return [
			{ key: 'name', caption: $localize`Ware`, hideable: false, link: (x) => ['/wares', x.ware] },
			SupplyDemandColumns.capacity('produced', $localize`Produced/h`, PER_HOUR, true),
			SupplyDemandColumns.capacity('consumed', $localize`Consumed/h`, PER_HOUR, false),
			SupplyDemandColumns.capacity('net', $localize`Net/h`, NET, true),
			SupplyDemandColumns.balance(),
			{
				key: 'value',
				caption: $localize`Value/h`,
				type: 'number',
				format: NET,
				group: SupplyDemandColumns.CAPACITY,
				value: (x) => x.value,
				display: (x) =>
					x.mined ? '' : NumberFormats.compact(x.value, { signed: true }) + SupplyDemandColumns.mark(x),
				title: (x) =>
					x.mined
						? SupplyDemandColumns.MINING
						: [NumberFormats.format(x.value, NET), SupplyDemandColumns.buildingNote(x)]
								.filter(Boolean)
								.join(' · '),
			},
			SupplyDemandColumns.count('producers', $localize`Producers`),
			SupplyDemandColumns.count('consumers', $localize`Consumers`),
			SupplyDemandColumns.diagnosis(),
			SupplyDemandColumns.market('stock', $localize`Stock offered`, false, false),
			SupplyDemandColumns.market('wanted', $localize`Wanted`, false, false),
			SupplyDemandColumns.market('lowestSell', $localize`Lowest sell`, true),
			SupplyDemandColumns.market('highestBuy', $localize`Highest buy`, true),
			{
				key: 'priceIndex',
				caption: $localize`Price index`,
				type: 'number',
				group: SupplyDemandColumns.MARKET,
				hidden: true,
				value: (x) => x.priceIndex,
				display: (x) => (x.priceIndex === undefined ? '' : NumberFormats.percent(x.priceIndex / 100)),
				title: () => $localize`Average offer price as a percentage of the ware's average price`,
			},
		];
	}

	/** Net as a share of the larger flow, as a signed percentage with a bar; mined wares have none. */
	private static balance(): GridColumn<SupplyDemandRow> {
		return {
			key: 'balance',
			caption: $localize`Balance`,
			type: 'number',
			group: SupplyDemandColumns.CAPACITY,
			value: (x) => (x.mined ? undefined : x.balance * 100),
			display: (x) =>
				x.mined
					? SupplyDemandColumns.DASH
					: NumberFormats.signedPercent(x.balance) + SupplyDemandColumns.mark(x),
			bar: (x) => (x.mined ? undefined : x.balance),
			title: (x) =>
				x.mined
					? SupplyDemandColumns.MINING
					: [SupplyDemandColumns.BALANCE, SupplyDemandColumns.buildingNote(x)].filter(Boolean).join(' · '),
		};
	}

	/** The diagnosis: a dot and its words, filtered by kind and sorted from the worst to the best. */
	private static diagnosis(): GridColumn<SupplyDemandRow> {
		return {
			key: 'diagnosis',
			caption: $localize`Diagnosis`,
			group: SupplyDemandColumns.DIAGNOSIS,
			lookup: Diagnoses.KINDS.map((kind) => ({ value: kind, label: SupplyDemandDiagnosis.KINDS[kind] })),
			value: (x) => x.diagnosis.kind,
			sortValue: (x) => Diagnoses.rank(x.diagnosis),
			display: (x) => SupplyDemandDiagnosis.label(x.diagnosis),
			dot: (x) => SupplyDemandDiagnosis.dot(x.diagnosis),
			title: (x) => SupplyDemandDiagnosis.explanation(x),
		};
	}

	/** The asterisk of the capacity numbers of building materials, whose building demand isn't counted. */
	private static mark(row: SupplyDemandRow): string {
		return row.building || row.partlyBuilding ? '*' : '';
	}

	/** Why a building material's capacity numbers are marked; undefined for other wares. */
	private static buildingNote(row: SupplyDemandRow): string | undefined {
		if (row.building) {
			return SupplyDemandColumns.BUILDING;
		}
		return row.partlyBuilding ? SupplyDemandColumns.PARTLY_BUILDING : undefined;
	}

	/** A per hour column: mined wares show a dash where mining isn't counted, building materials an asterisk. */
	private static capacity(
		key: 'produced' | 'consumed' | 'net',
		caption: string,
		format: Intl.NumberFormatOptions,
		minedBlank: boolean,
		hidden = false
	): GridColumn<SupplyDemandRow> {
		const blank = (x: SupplyDemandRow) => minedBlank && x.mined;
		return {
			key,
			caption,
			type: 'number',
			format,
			hidden,
			group: SupplyDemandColumns.CAPACITY,
			value: (x) => (blank(x) ? 0 : x[key]),
			display: (x) =>
				blank(x)
					? SupplyDemandColumns.DASH
					: NumberFormats.format(x[key], format) + SupplyDemandColumns.mark(x),
			title: (x) => (blank(x) ? SupplyDemandColumns.MINING : SupplyDemandColumns.buildingNote(x)),
		};
	}

	private static count(key: 'producers' | 'consumers', caption: string): GridColumn<SupplyDemandRow> {
		return {
			key,
			caption,
			type: 'number',
			group: SupplyDemandColumns.CAPACITY,
			hidden: true,
			value: (x) => x[key],
		};
	}

	private static market(
		key: 'stock' | 'wanted' | 'lowestSell' | 'highestBuy',
		caption: string,
		price: boolean,
		hidden = true
	): GridColumn<SupplyDemandRow> {
		return {
			key,
			caption,
			type: 'number',
			format: price ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : undefined,
			group: SupplyDemandColumns.MARKET,
			value: (x) => x[key],
			hidden,
		};
	}
}
