import { describe, expect, it } from 'vitest';
import { Duration } from './duration';

describe('Duration', () => {
	it('shows the two largest units in short', () => {
		expect(Duration.short(42)).toBe('42s');
		expect(Duration.short(125)).toBe('2m 5s');
		expect(Duration.short(3720)).toBe('1h 2m');
		expect(Duration.short(0)).toBe('0s');
	});

	it('shows hours and whole minutes', () => {
		expect(Duration.hoursMinutes(39121.904)).toBe('10h 52m');
		expect(Duration.hoursMinutes(59)).toBe('0h 0m');
	});

	it('spells out minutes and seconds, leaving out a zero part', () => {
		expect(Duration.long(90)).toBe('1 minute 30 seconds');
		expect(Duration.long(120)).toBe('2 minutes');
		expect(Duration.long(1)).toBe('1 second');
		expect(Duration.long(0)).toBe('');
	});
});
