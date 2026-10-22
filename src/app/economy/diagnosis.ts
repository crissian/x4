/** What the capacity and the market of a ware say together. */
export type DiagnosisKind = 'short' | 'starved' | 'tight' | 'covered' | 'balanced' | 'glut' | 'surplus';

/** How far off a diagnosis is: from the balance for capacity ones, from the price index for market ones. */
export type Severity = 'slight' | 'moderate' | 'severe';

export interface Diagnosis {
	kind: DiagnosisKind;
	/** none for balanced and calm */
	severity?: Severity;
	/** judged from the market only: mining and ship building are not counted for the ware */
	marketOnly: boolean;
}

export type MarketState = 'tight' | 'calm' | 'glut';

/** Combines the built capacity and the market of a ware into one diagnosis. */
export class Diagnoses {
	/** The kinds from the most to the least worrying, which is how the table sorts them. */
	static readonly KINDS: readonly DiagnosisKind[] = [
		'short',
		'starved',
		'tight',
		'covered',
		'balanced',
		'glut',
		'surplus',
	];

	/** Price index (%) from which offers are dear, and up to which they are cheap. */
	static readonly TIGHT_INDEX = 105;
	static readonly GLUT_INDEX = 95;
	/** Share of the larger flow that a net may differ by and still count as balanced. */
	static readonly BALANCED = 0.02;
	/** Balance (share of the larger flow) below which a diagnosis is slight, and above which it is severe. */
	static readonly SLIGHT = 0.1;
	static readonly SEVERE = 0.3;
	/** Price index distance from 100 (%) above which a market diagnosis is severe. */
	static readonly SEVERE_INDEX = 15;

	private static readonly SEVERITIES: readonly (Severity | undefined)[] = ['severe', 'moderate', 'slight', undefined];

	/** Tight when the offers are dear, glut when cheap; calm without offers. */
	static market(priceIndex: number | undefined): MarketState {
		if (priceIndex === undefined) {
			return 'calm';
		}
		if (priceIndex >= Diagnoses.TIGHT_INDEX) {
			return 'tight';
		}
		return priceIndex <= Diagnoses.GLUT_INDEX ? 'glut' : 'calm';
	}

	/** How far the price index is from 100: moderate from 5 points, severe above 15; none when calm. */
	static marketSeverity(priceIndex: number | undefined): Severity | undefined {
		if (Diagnoses.market(priceIndex) === 'calm') {
			return undefined;
		}
		return Math.abs((priceIndex ?? 100) - 100) > Diagnoses.SEVERE_INDEX ? 'severe' : 'moderate';
	}

	/** How big a balance is: slight under 10%, severe above 30%, else moderate. */
	static balanceSeverity(balance: number): Severity {
		const size = Math.abs(balance);
		if (size < Diagnoses.SLIGHT) {
			return 'slight';
		}
		return size > Diagnoses.SEVERE ? 'severe' : 'moderate';
	}

	/**
	 * @param balance net divided by the larger of produced and consumed, -1..1
	 * @param priceIndex average sell offer price as % of the ware's average price; undefined without sell offers,
	 * which makes a ware built short `short` (nothing covers it)
	 * @param marketOnly mined and building wares, whose capacity is not known: only the market counts
	 */
	static of(balance: number, priceIndex: number | undefined, marketOnly: boolean): Diagnosis {
		const market = Diagnoses.market(priceIndex);
		const marketSeverity = Diagnoses.marketSeverity(priceIndex);
		if (marketOnly || Math.abs(balance) <= Diagnoses.BALANCED) {
			const kind = market === 'calm' ? 'balanced' : market;
			return { kind, severity: marketSeverity, marketOnly };
		}
		const severity = Diagnoses.balanceSeverity(balance);
		if (balance < 0) {
			// nothing on sale covers the gap, so a ware without sell offers is short as well
			const uncovered = market === 'tight' || priceIndex === undefined;
			return { kind: uncovered ? 'short' : 'covered', severity, marketOnly };
		}
		return { kind: market === 'tight' ? 'starved' : 'surplus', severity, marketOnly };
	}

	/** Sort key: lower is worse; within a kind the more severe comes first. */
	static rank(diagnosis: Diagnosis): number {
		return (
			Diagnoses.KINDS.indexOf(diagnosis.kind) * Diagnoses.SEVERITIES.length +
			Diagnoses.SEVERITIES.indexOf(diagnosis.severity)
		);
	}
}
