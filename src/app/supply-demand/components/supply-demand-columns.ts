import { Diagnoses } from '../../economy/diagnosis';
import type { GridColumn, GridGroup } from '../../shared/components/data-grid/data-grid.component';
import { SupplyDemandDiagnosis } from '../supply-demand-diagnosis';
import type { SupplyDemandRow } from '../supply-demand-model';

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

	private static readonly PER_HOUR: Intl.NumberFormatOptions = { maximumFractionDigits: 0 };
	private static readonly NET: Intl.NumberFormatOptions = { maximumFractionDigits: 0, signDisplay: 'exceptZero' };
	/** Big values such as 16.2M, with the full number in the title. */
	private static readonly COMPACT: Intl.NumberFormatOptions = {
		notation: 'compact',
		maximumFractionDigits: 1,
		signDisplay: 'exceptZero',
	};
	private static readonly DASH = '—';

	/** Mined wares have no capacity numbers; the table says so in a title. */
	private static readonly MINING = $localize`Mining is not counted`;
	private static readonly BUILDING = $localize`Excludes ship and station building`;
	private static readonly PARTLY_BUILDING = $localize`Also used to build ships and stations; real demand is higher`;

	static all(): GridColumn<SupplyDemandRow>[] {
		const { NET, PER_HOUR } = SupplyDemandColumns;
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
				display: (x) => (x.mined ? '' : SupplyDemandColumns.number(x.value, SupplyDemandColumns.COMPACT)),
				title: (x) => (x.mined ? SupplyDemandColumns.MINING : SupplyDemandColumns.number(x.value, NET)),
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
				display: (x) => (x.priceIndex === undefined ? '' : `${Math.round(x.priceIndex)}%`),
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
			display: (x) => (x.mined ? SupplyDemandColumns.DASH : SupplyDemandDiagnosis.percent(x.balance)),
			bar: (x) => (x.mined ? undefined : x.balance),
			title: (x) =>
				x.mined
					? SupplyDemandColumns.MINING
					: $localize`Net as a share of the larger of produced and consumed: how much of the demand is unmet, or of the output unused`,
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

	private static number(value: number, format: Intl.NumberFormatOptions): string {
		return new Intl.NumberFormat(undefined, format).format(value);
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
					: SupplyDemandColumns.number(x[key], format) + (x.building || x.partlyBuilding ? '*' : ''),
			title: (x) =>
				blank(x)
					? SupplyDemandColumns.MINING
					: x.building
						? SupplyDemandColumns.BUILDING
						: x.partlyBuilding
							? SupplyDemandColumns.PARTLY_BUILDING
							: undefined,
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
