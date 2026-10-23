import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { QueryParams } from './query-params';

describe('QueryParams', () => {
	const params = convertToParamMap({ mode: 'here', ware: 'ore', jumps: '4', speed: '250.5', empty: '' });

	it('reads one of the allowed values, else the fallback', () => {
		expect(QueryParams.oneOf(params, 'mode', ['where', 'here'], 'where')).toBe('here');
		expect(QueryParams.oneOf(params, 'mode', ['where'], 'where')).toBe('where');
		expect(QueryParams.oneOf(params, 'missing', ['where'], 'where')).toBe('where');
	});

	it('reads and writes a flag as 1', () => {
		expect(QueryParams.flag(convertToParamMap({ on: '1', off: 'true' }), 'on')).toBe(true);
		expect(QueryParams.flag(convertToParamMap({ off: 'true' }), 'off')).toBe(false);
		expect(QueryParams.writeFlag(true)).toBe('1');
		expect(QueryParams.writeFlag(false)).toBeNull();
	});

	it('reads a value the check knows, else the fallback', () => {
		const known = (id: string) => id === 'ore';
		expect(QueryParams.known(params, 'ware', known)).toBe('ore');
		expect(QueryParams.known(params, 'mode', known)).toBe('');
		expect(QueryParams.known(params, 'missing', known, 'x')).toBe('x');
	});

	it('reads a number in range, else the fallback', () => {
		expect(QueryParams.number(params, 'jumps', { min: 0, integer: true }, 3)).toBe(4);
		expect(QueryParams.number(params, 'jumps', { min: 1, max: 3 }, 3)).toBe(3);
		expect(QueryParams.number(params, 'speed', { min: 100 }, 1)).toBe(250.5);
		expect(QueryParams.number(params, 'speed', { min: 100, integer: true }, 1)).toBe(1);
		expect(QueryParams.number(params, 'empty', { min: 0 }, 2)).toBe(2);
		expect(QueryParams.number(params, 'mode', { min: 0 }, 2)).toBe(2);
	});

	it('leaves defaults out', () => {
		expect(QueryParams.unlessDefault('open', 'closed')).toBe('open');
		expect(QueryParams.unlessDefault(3, 3)).toBeNull();
	});

	it('puts numbers out of range back at their defaults', () => {
		const defaults = { jumps: 3, cargo: 10, name: '' };
		const ranges = { jumps: { min: 1, max: 6, integer: true }, cargo: { min: 1 } };
		const model = { jumps: 4, cargo: 5.5, name: 'a' };
		expect(QueryParams.clean(model, ranges, defaults)).toBe(model);
		expect(QueryParams.clean({ jumps: 7, cargo: NaN, name: 'a' }, ranges, defaults)).toEqual({
			jumps: 3,
			cargo: 10,
			name: 'a',
		});
	});
});
