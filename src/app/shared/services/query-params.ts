import type { ParamMap } from '@angular/router';

/** The values a number param accepts. */
export interface NumberRange {
	min: number;
	max?: number;
	/** only whole numbers */
	integer?: boolean;
}

/** Reads checked values from URL query params, and leaves defaults out when writing them back. */
export class QueryParams {
	/** The param when it is one of the allowed values, else the fallback. */
	static oneOf<T extends string>(params: ParamMap, key: string, allowed: readonly T[], fallback: T): T {
		const value = params.get(key);
		return allowed.find((x) => x === value) ?? fallback;
	}

	/** A flag param: `1` for true. */
	static flag(params: ParamMap, key: string): boolean {
		return params.get(key) === '1';
	}

	/** A flag as a param: `1`, or null for false (so a merge removes it). */
	static writeFlag(value: boolean): '1' | null {
		return value ? '1' : null;
	}

	/** The param when the check knows it, else the fallback. */
	static known(params: ParamMap, key: string, check: (value: string) => boolean, fallback = ''): string {
		const value = params.get(key) ?? '';
		return check(value) ? value : fallback;
	}

	/** The param as a number in the range, else the fallback. */
	static number(params: ParamMap, key: string, range: NumberRange, fallback: number): number {
		const raw = params.get(key);
		const value = raw ? Number(raw) : NaN;
		return QueryParams.inRange(value, range) ? value : fallback;
	}

	/** The value is a (whole, if asked) number in the range. */
	static inRange(value: number, { min, max, integer }: NumberRange): boolean {
		return (
			(integer ? Number.isInteger(value) : Number.isFinite(value)) &&
			value >= min &&
			(max == null || value <= max)
		);
	}

	/** The value, or null for the default (so a merge removes the param). */
	static unlessDefault<T>(value: T, fallback: T): T | null {
		return value === fallback ? null : value;
	}

	/** The model with the numbers out of their range back at their defaults. */
	static clean<T extends object>(model: T, ranges: { [K in keyof T]?: NumberRange }, defaults: Readonly<T>): T {
		let result = model;
		for (const key of Object.keys(ranges) as (keyof T)[]) {
			if (!QueryParams.inRange(model[key] as number, ranges[key]!)) {
				result = { ...result, [key]: defaults[key] };
			}
		}
		return result;
	}
}
