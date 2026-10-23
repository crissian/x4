import { describe, expect, it } from 'vitest';
import { JumpsPipe } from './jumps.pipe';

describe('JumpsPipe', () => {
	const pipe = new JumpsPipe();

	it('uses the singular for one jump only', () => {
		expect(pipe.transform(1)).toBe('1 jump');
		expect(pipe.transform(4)).toBe('4 jumps');
		expect(pipe.transform(2, 'within')).toBe('within 2 jumps');
	});

	it('says here for no jump in the away form', () => {
		expect(pipe.transform(0, 'away')).toBe('here');
		expect(pipe.transform(1, 'away')).toBe('1 jump');
		expect(pipe.transform(0)).toBe('0 jumps');
	});

	it('is empty without a count', () => {
		expect(pipe.transform(undefined)).toBe('');
		expect(pipe.transform(null)).toBe('');
	});
});
