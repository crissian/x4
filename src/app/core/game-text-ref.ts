export class GameTextRef {
	private static readonly PATTERN = /^\{(\d+),\s*(\d+)\}$/;

	/** True for a `{page,id}` game text reference. */
	static isRef(value: string): boolean {
		return GameTextRef.PATTERN.test(value.trim());
	}

	/** The page and id of a `{page,id}` game text reference; undefined for anything else. */
	static parse(ref: string): { page: number; id: number } | undefined {
		const match = GameTextRef.PATTERN.exec(ref.trim());
		return match ? { page: +match[1], id: +match[2] } : undefined;
	}

	/** Resolves a `{page,id}` game text reference; anything else (or an unknown reference) gives undefined. */
	static resolve(ref: string, texts: Record<string, { name: string }>): string | undefined {
		const parsed = GameTextRef.parse(ref);
		return parsed ? texts[`${parsed.page},${parsed.id}`]?.name : undefined;
	}
}
