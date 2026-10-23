import { describe, expect, it } from 'vitest';
import { NumberFormats } from './number-formats';

describe('NumberFormats', () => {
	it('formats whole and signed numbers', () => {
		expect(NumberFormats.whole(1234.6)).toBe('1,235');
		expect(NumberFormats.signedWhole(1234)).toBe('+1,234');
		expect(NumberFormats.signedWhole(-5)).toBe('-5');
		expect(NumberFormats.signedWhole(0)).toBe('0');
	});

	it('formats ratios as percentages', () => {
		expect(NumberFormats.percent(0.424)).toBe('42%');
		expect(NumberFormats.signedPercent(0.12)).toBe('+12%');
		expect(NumberFormats.signedPercent(-0.24)).toBe('-24%');
		expect(NumberFormats.signedPercent(0)).toBe('0%');
	});

	it('formats big numbers compactly, signed on demand', () => {
		expect(NumberFormats.compact(1818450000)).toBe('1.8B');
		expect(NumberFormats.compact(340000, { signed: true })).toBe('+340K');
		expect(NumberFormats.compact(-1200000, { signed: true })).toBe('-1.2M');
	});

	it('formats metres as kilometres', () => {
		expect(NumberFormats.km(12500)).toBe('12.5');
		expect(NumberFormats.km(3000)).toBe('3.0');
		expect(NumberFormats.km(1234567, 0)).toBe('1,235');
	});

	it('shares one formatter per set of options', () => {
		expect(NumberFormats.formatter({ maximumFractionDigits: 2 })).toBe(
			NumberFormats.formatter({ maximumFractionDigits: 2 })
		);
	});
});
