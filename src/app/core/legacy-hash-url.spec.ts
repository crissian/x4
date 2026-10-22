import { describe, expect, it } from 'vitest';
import { LegacyHashUrl } from './legacy-hash-url';

describe('legacy hash urls', () => {
	it('maps old hash links to path urls', () => {
		expect(LegacyHashUrl.toPath('#/ships/ship_arg_s_fighter_01_a_macro')).toBe('ships/ship_arg_s_fighter_01_a_macro');
		expect(LegacyHashUrl.toPath('#/station-calculator?l=@$module-module_gen_prod_hullparts_01,count:4')).toBe(
			'station-calculator?l=@$module-module_gen_prod_hullparts_01,count:4'
		);
		expect(LegacyHashUrl.toPath('#/')).toBe('');
	});

	it('leaves other urls alone', () => {
		expect(LegacyHashUrl.toPath('')).toBeNull();
		expect(LegacyHashUrl.toPath('#section')).toBeNull();
	});
});
