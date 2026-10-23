import { LocalStorage } from '../../../core/services/local-storage';

/** The page size a user chose in a grid, kept in local storage per grid key, or shared by grids without one. */
export class GridPageSizePrefs {
	/** The page size a grid starts with when nothing was chosen, if its list has it. */
	static readonly defaultSize = 50;

	static key(storageKey: string | undefined): string {
		return storageKey ? `grid-page-size:${storageKey}` : 'grid-page-size';
	}

	/**
	 * The saved size when the grid offers it, else the default; a grid without the default starts with its largest
	 * size below it, or its first.
	 */
	static read(key: string, sizes: readonly number[]): number {
		const saved = LocalStorage.read<number | null>(key, null, (x) => (typeof x === 'number' ? x : undefined));
		if (saved != null && sizes.includes(saved)) {
			return saved;
		}
		return sizes.filter((x) => x <= GridPageSizePrefs.defaultSize).at(-1) ?? sizes[0];
	}

	static write(key: string, size: number) {
		LocalStorage.write(key, size);
	}
}
