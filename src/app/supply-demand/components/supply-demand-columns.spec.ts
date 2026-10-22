import { describe, expect, it } from 'vitest';
import { Diagnoses } from '../../economy/diagnosis';
import type { SupplyDemandRow } from '../supply-demand-model';
import { SupplyDemandColumns } from './supply-demand-columns';

describe('SupplyDemandColumns', () => {
	function row(extra: Partial<SupplyDemandRow> = {}): SupplyDemandRow {
		return {
			ware: 'x',
			name: 'X',
			group: '',
			produced: 200,
			consumed: 100,
			net: 100,
			balance: 0.5,
			value: 1000,
			producers: 1,
			consumers: 1,
			stock: 0,
			wanted: 0,
			priceIndex: undefined,
			mined: false,
			building: false,
			partlyBuilding: false,
			marketBased: false,
			diagnosis: Diagnoses.of(0.5, undefined, false),
			...extra,
		};
	}
	const column = (key: string) => SupplyDemandColumns.all().find((x) => x.key === key)!;

	it('marks the capacity value and balance of building materials', () => {
		for (const key of ['value', 'balance', 'net']) {
			expect(column(key).display!(row())).not.toContain('*');
			expect(column(key).display!(row({ building: true }))).toContain('*');
			expect(column(key).display!(row({ partlyBuilding: true }))).toContain('*');
			expect(column(key).title!(row({ building: true }))).toContain('Excludes ship and station building');
			expect(column(key).title!(row({ partlyBuilding: true }))).toContain('real demand is higher');
		}
	});
});
