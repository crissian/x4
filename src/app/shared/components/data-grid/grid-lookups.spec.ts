import { describe, expect, it } from 'vitest';
import { GridLookups } from './grid-lookups';

enum Fruit {
	apple = 'Apple',
	pear = 'Pear',
}

describe('GridLookups', () => {
	it('lists the values of a string enum', () => {
		expect(GridLookups.ofEnum(Fruit).map((x) => x.value)).toEqual(['Apple', 'Pear']);
	});
});
