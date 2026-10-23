import { describe, expect, it } from 'vitest';
import { JumpTexts } from './jump-texts';

describe('JumpTexts', () => {
	it('uses the singular for one jump only', () => {
		expect(JumpTexts.within(1)).toBe('within 1 jump');
		expect(JumpTexts.within(3)).toBe('within 3 jumps');
		expect(JumpTexts.distance(1)).toBe('1 jump');
		expect(JumpTexts.distance(2)).toBe('2 jumps');
		expect(JumpTexts.distance(0)).toBe('0 jumps');
	});
});
