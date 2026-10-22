import { LocalStorage } from '../../../core/services/local-storage';

/** The columns a user chose in a grid, kept in local storage. */
export class GridColumnPrefs {
	/**
	 * The saved shown columns and the columns known when saving; `known` is null for lists saved before it was
	 * kept, which then apply to every column.
	 */
	static read(key: string | undefined): { shown: string[]; known: string[] | null } | null {
		if (!key) {
			return null;
		}
		const list = (x: unknown) => (Array.isArray(x) ? (x as string[]) : undefined);
		const shown = LocalStorage.read<string[] | null>(`grid-columns:${key}`, null, list);
		return shown && { shown, known: LocalStorage.read<string[] | null>(`grid-columns-known:${key}`, null, list) };
	}

	/** Saves the shown columns, keeping the choice for saved columns the grid doesn't have right now. */
	static write(key: string, columns: readonly string[], shown: readonly string[]) {
		const saved = GridColumnPrefs.read(key);
		const absent = (x: string) => !columns.includes(x);
		LocalStorage.write(`grid-columns:${key}`, [...shown, ...(saved?.shown.filter(absent) ?? [])]);
		LocalStorage.write(`grid-columns-known:${key}`, [...columns, ...(saved?.known?.filter(absent) ?? [])]);
	}
}
