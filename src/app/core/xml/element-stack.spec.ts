import { describe, expect, it } from 'vitest';
import { ElementStack } from './element-stack';

const noAttrs = () => ({});

describe('ElementStack', () => {
	it('tracks nested selected elements and pops on close', () => {
		const stack = new ElementStack<string>((name) => (name === 'a' || name === 'b' ? name : undefined));
		stack.open('a', ['r', 'a'], noAttrs);
		stack.open('b', ['r', 'a', 'b'], noAttrs);
		expect(stack.size).toBe(2);
		stack.close('b', ['r', 'a', 'b']);
		expect(stack.size).toBe(1);
		stack.close('a', ['r', 'a']);
		expect(stack.size).toBe(0);
	});

	it('nearest returns the innermost match with its depth', () => {
		const stack = new ElementStack<string>((name) => name);
		stack.open('x', ['x'], noAttrs);
		stack.open('y', ['x', 'y'], noAttrs);
		stack.open('x', ['x', 'y', 'x'], noAttrs);
		expect(stack.nearest((value) => value === 'x')).toEqual({ value: 'x', depth: 3 });
		expect(stack.nearest((value) => value === 'y')).toEqual({ value: 'y', depth: 2 });
		expect(stack.nearest((_value, depth) => depth === 1)?.value).toBe('x');
		expect(stack.nearest((value) => value === 'z')).toBeUndefined();
	});

	it('ignores elements the selector rejects', () => {
		const stack = new ElementStack<string>((name) => (name === 'keep' ? name : undefined));
		stack.open('skip', ['skip'], noAttrs);
		stack.open('keep', ['skip', 'keep'], noAttrs);
		stack.close('keep', ['skip', 'keep']);
		stack.close('skip', ['skip']);
		stack.open('skip', ['skip'], noAttrs);
		stack.close('skip', ['skip']);
		expect(stack.size).toBe(0);
	});
});
