import { GameTextRef } from './game-text-ref';

describe('GameTextRef', () => {
	const texts = { '20102,1441': { name: 'Xenon Wharf' } };

	it('resolves a reference', () => {
		expect(GameTextRef.resolve('{20102,1441}', texts)).toBe('Xenon Wharf');
	});

	it('gives undefined for unknown references and plain text', () => {
		expect(GameTextRef.resolve('{20102,9}', texts)).toBeUndefined();
		expect(GameTextRef.resolve('ANT Argon Raumdock', texts)).toBeUndefined();
		expect(GameTextRef.resolve('', texts)).toBeUndefined();
	});

	it('recognises references', () => {
		expect(GameTextRef.isRef('{20102,1441}')).toBe(true);
		expect(GameTextRef.isRef(' {20102, 1441} ')).toBe(true);
		expect(GameTextRef.isRef('ANT Argon Raumdock')).toBe(false);
	});

	it('parses references', () => {
		expect(GameTextRef.parse('{20102, 1441}')).toEqual({ page: 20102, id: 1441 });
		expect(GameTextRef.parse('Xenon Wharf')).toBeUndefined();
	});
});
