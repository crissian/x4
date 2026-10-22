import { RomanNumeral } from './roman';

describe('RomanNumeral', () => {
	it('converts numbers', () => {
		expect(RomanNumeral.of(1)).toBe('I');
		expect(RomanNumeral.of(4)).toBe('IV');
		expect(RomanNumeral.of(9)).toBe('IX');
		expect(RomanNumeral.of(15)).toBe('XV');
		expect(RomanNumeral.of(1994)).toBe('MCMXCIV');
	});

	it('returns an empty string below 1', () => {
		expect(RomanNumeral.of(0)).toBe('');
		expect(RomanNumeral.of(-3)).toBe('');
	});
});
