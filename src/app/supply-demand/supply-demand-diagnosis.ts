import type { Diagnosis, DiagnosisKind, Severity } from '../economy/diagnosis';
import type { WareEconomy } from '../economy/economy-model';
import type { GridDot, GridTone } from '../shared/components/data-grid/data-grid.component';
import { CompactNumber } from '../shared/format/compact-number';

/** The words, explanations and colours of a ware's diagnosis. */
export class SupplyDemandDiagnosis {
	static readonly KINDS: Record<DiagnosisKind, string> = {
		short: $localize`:diagnosis:Short`,
		starved: $localize`:diagnosis:Starved`,
		tight: $localize`:diagnosis:Tight market`,
		covered: $localize`:diagnosis:Covered`,
		balanced: $localize`:diagnosis:Balanced`,
		glut: $localize`:diagnosis:Glut`,
		surplus: $localize`:diagnosis:Surplus`,
	};

	static readonly SEVERITIES: Record<Severity, string> = {
		slight: $localize`:diagnosis severity:slight`,
		moderate: $localize`:diagnosis severity:moderate`,
		severe: $localize`:diagnosis severity:severe`,
	};

	private static readonly MEANINGS: Record<DiagnosisKind, string> = {
		short: $localize`Not enough is built, and prices are high or nothing is on sale`,
		starved: $localize`Enough is built, but little reaches the market: factories likely lack inputs, or ship building uses it`,
		tight: $localize`Prices are high, though the built capacity is balanced`,
		covered: $localize`Built short, but stock or traders cover it for now`,
		balanced: $localize`What is built matches what is used, and prices are normal`,
		glut: $localize`Offers are cheap, though the built capacity is balanced`,
		surplus: $localize`More is built than used, and prices are not high`,
	};

	private static readonly TONES: Record<DiagnosisKind, GridTone> = {
		short: 'red',
		starved: 'orange',
		tight: 'amber',
		covered: 'grey',
		balanced: 'grey',
		glut: 'teal',
		surplus: 'green',
	};

	private static readonly LEVELS: Record<Severity, 1 | 2 | 3> = { slight: 1, moderate: 2, severe: 3 };

	private static readonly MARKET_ONLY = $localize`(market only)`;

	/** The kind as the table says it: a calm market-only ware is not "balanced", as nothing is balanced there. */
	static kind(diagnosis: Diagnosis): string {
		return diagnosis.kind === 'balanced' && diagnosis.marketOnly
			? $localize`:diagnosis:Calm`
			: SupplyDemandDiagnosis.KINDS[diagnosis.kind];
	}

	/** For example "Short · severe", with "(market only)" after it when the capacity is not counted. */
	static label(diagnosis: Diagnosis): string {
		const kind = SupplyDemandDiagnosis.kind(diagnosis);
		const text = diagnosis.severity
			? $localize`${kind}:KIND: · ${SupplyDemandDiagnosis.SEVERITIES[diagnosis.severity]}:SEVERITY:`
			: kind;
		return diagnosis.marketOnly ? `${text} ${SupplyDemandDiagnosis.MARKET_ONLY}` : text;
	}

	/** What the diagnosis means, and for market-only wares why the capacity is not used. */
	static explanation(row: WareEconomy): string {
		const { diagnosis } = row;
		if (!diagnosis.marketOnly) {
			return SupplyDemandDiagnosis.MEANINGS[diagnosis.kind];
		}
		const reason = row.mined
			? $localize`Mining is not counted, so only the market tells.`
			: $localize`Ship and station building is not counted, so only the market tells.`;
		const market =
			diagnosis.kind === 'tight'
				? $localize`Prices are high`
				: diagnosis.kind === 'glut'
					? $localize`Offers are cheap`
					: $localize`Prices are normal`;
		return `${market}. ${reason}`;
	}

	/** The dot of a diagnosis: its colour, and its shade from how severe it is. */
	static dot(diagnosis: Diagnosis): GridDot {
		const level = diagnosis.severity ? SupplyDemandDiagnosis.LEVELS[diagnosis.severity] : 3;
		return { tone: SupplyDemandDiagnosis.TONES[diagnosis.kind], level };
	}

	/** A signed percentage such as +12% or -24%. */
	static percent(ratio: number): string {
		return new Intl.NumberFormat(undefined, {
			style: 'percent',
			maximumFractionDigits: 0,
			signDisplay: 'exceptZero',
		}).format(ratio);
	}

	/** How much of the demand is unmet, or of the output unused. */
	static balance(ratio: number): string {
		if (Math.round(ratio * 100) === 0) {
			return $localize`balanced`;
		}
		const percent = SupplyDemandDiagnosis.percent(ratio);
		return ratio < 0
			? $localize`${percent}:PERCENT: of demand unmet`
			: $localize`${percent}:PERCENT: of output unused`;
	}

	/** One line for the detail panel, such as "Short · severe — -24% of demand unmet, -16.2M Cr/h". */
	static summary(row: WareEconomy): string {
		const label = SupplyDemandDiagnosis.label(row.diagnosis);
		if (row.diagnosis.marketOnly) {
			const index = row.priceIndex === undefined ? undefined : Math.round(row.priceIndex);
			return index === undefined ? label : `${label} — ${$localize`price index ${index}:INDEX:%`}`;
		}
		const value = CompactNumber.format(row.value);
		return `${label} — ${SupplyDemandDiagnosis.balance(row.balance)}, ${$localize`${value}:VALUE: Cr/h`}`;
	}
}
