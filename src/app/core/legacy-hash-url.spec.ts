import { describe, expect, it } from 'vitest';
import { legacyHashUrl } from './legacy-hash-url';

describe('legacy hash urls', () => {
	it('maps old hash links to path urls', () => {
		expect(legacyHashUrl('#/ships/ship_arg_s_fighter_01_a_macro')).toBe('ships/ship_arg_s_fighter_01_a_macro');
		expect(legacyHashUrl('#/station-calculator?l=@$module-module_gen_prod_hullparts_01,count:4')).toBe(
			'station-calculator?l=@$module-module_gen_prod_hullparts_01,count:4'
		);
		expect(legacyHashUrl('#/')).toBe('');
	});

	it('leaves other urls alone', () => {
		expect(legacyHashUrl('')).toBeNull();
		expect(legacyHashUrl('#section')).toBeNull();
	});
});
