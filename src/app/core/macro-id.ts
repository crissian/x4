/** Ids of game macros as the app keys them: lowercased without the `_macro` suffix (e.g. `cluster_01_sector001`). */
export class MacroId {
	static of(macro: string): string {
		const lower = macro.toLowerCase();
		return lower.endsWith('_macro') ? lower.slice(0, -'_macro'.length) : lower;
	}
}
