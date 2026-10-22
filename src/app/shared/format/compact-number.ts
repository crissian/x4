/** Big numbers in a short, signed form, such as +340K or -1.2M. */
export class CompactNumber {
	private static readonly FORMAT = new Intl.NumberFormat(undefined, {
		notation: 'compact',
		maximumFractionDigits: 1,
		signDisplay: 'exceptZero',
	});

	static format(value: number): string {
		return CompactNumber.FORMAT.format(value);
	}
}
