export class RomanNumeral {
	private static readonly NUMERALS: [number, string][] = [
		[1000, 'M'],
		[900, 'CM'],
		[500, 'D'],
		[400, 'CD'],
		[100, 'C'],
		[90, 'XC'],
		[50, 'L'],
		[40, 'XL'],
		[10, 'X'],
		[9, 'IX'],
		[5, 'V'],
		[4, 'IV'],
		[1, 'I'],
	];

	/** Roman numeral of a positive integer; empty for anything below 1. */
	static of(n: number): string {
		let rest = Math.floor(n);
		let result = '';
		for (const [value, symbol] of RomanNumeral.NUMERALS) {
			while (rest >= value) {
				result += symbol;
				rest -= value;
			}
		}
		return result;
	}
}
