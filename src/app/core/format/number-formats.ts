import { Language } from '../language';

/**
 * Number texts in the selected language: the formatters are built with the app locale (not the browser's), once per
 * set of options. Tables pass their own options through `formatter()`; the common forms have their own helpers.
 */
export class NumberFormats {
	static readonly WHOLE: Intl.NumberFormatOptions = { maximumFractionDigits: 0 };
	static readonly SIGNED_WHOLE: Intl.NumberFormatOptions = { maximumFractionDigits: 0, signDisplay: 'exceptZero' };
	static readonly PERCENT: Intl.NumberFormatOptions = { style: 'percent', maximumFractionDigits: 0 };
	static readonly SIGNED_PERCENT: Intl.NumberFormatOptions = { ...NumberFormats.PERCENT, signDisplay: 'exceptZero' };
	static readonly COMPACT: Intl.NumberFormatOptions = { notation: 'compact', maximumFractionDigits: 1 };
	static readonly SIGNED_COMPACT: Intl.NumberFormatOptions = { ...NumberFormats.COMPACT, signDisplay: 'exceptZero' };

	private static readonly formatters = new Map<string, Intl.NumberFormat>();

	/** The formatter of `options` in the app locale, shared by every caller with the same options. */
	static formatter(options: Intl.NumberFormatOptions = NumberFormats.WHOLE): Intl.NumberFormat {
		const key = JSON.stringify(options);
		let formatter = NumberFormats.formatters.get(key);
		if (!formatter) {
			formatter = new Intl.NumberFormat(Language.locale(), options);
			NumberFormats.formatters.set(key, formatter);
		}
		return formatter;
	}

	static format(value: number, options?: Intl.NumberFormatOptions): string {
		return NumberFormats.formatter(options).format(value);
	}

	/** 1,234 */
	static whole(value: number): string {
		return NumberFormats.format(value, NumberFormats.WHOLE);
	}

	/** +1,234 or -1,234; zero has no sign. */
	static signedWhole(value: number): string {
		return NumberFormats.format(value, NumberFormats.SIGNED_WHOLE);
	}

	/** A ratio as a whole percentage: 0.42 gives 42%. */
	static percent(ratio: number): string {
		return NumberFormats.format(ratio, NumberFormats.PERCENT);
	}

	/** A ratio as a signed whole percentage, such as +12% or -24%. */
	static signedPercent(ratio: number): string {
		return NumberFormats.format(ratio, NumberFormats.SIGNED_PERCENT);
	}

	/** Big numbers in a short form, such as 340K or 1.2M; `signed` adds the sign, such as +340K. */
	static compact(value: number, options: { signed?: boolean } = {}): string {
		return NumberFormats.format(value, options.signed ? NumberFormats.SIGNED_COMPACT : NumberFormats.COMPACT);
	}

	/** A distance in metres as kilometres with `digits` decimals, such as 12.5 (without the unit). */
	static km(metres: number, digits = 1): string {
		return NumberFormats.format(metres / 1000, { minimumFractionDigits: digits, maximumFractionDigits: digits });
	}
}
