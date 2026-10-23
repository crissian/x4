import { Size } from './data/size-data';

/** Orders things by ship size, smallest first; unknown sizes go last. */
export class SizeOrder {
	private static readonly SIZES: readonly string[] = Object.values(Size);

	static rank(size: string | undefined): number {
		const index = size ? SizeOrder.SIZES.indexOf(size) : -1;
		return index < 0 ? SizeOrder.SIZES.length : index;
	}

	/** A copy sorted by size, keeping the order within a size. */
	static sort<T>(items: readonly T[], sizeOf: (item: T) => string | undefined): T[] {
		return [...items].sort((a, b) => SizeOrder.rank(sizeOf(a)) - SizeOrder.rank(sizeOf(b)));
	}
}
