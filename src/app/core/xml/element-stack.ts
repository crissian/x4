import { XmlAttributes } from './xml-stream-scanner';

interface Entry<T> {
	value: T;
	depth: number;
}

/** Keeps a selected value for each open element the selector accepts; entries pop when their element closes. */
export class ElementStack<T> {
	private readonly entries: Entry<T>[] = [];

	constructor(
		private readonly select: (name: string, path: readonly string[], attrs: () => XmlAttributes) => T | undefined,
	) {}

	get size(): number {
		return this.entries.length;
	}

	open(name: string, path: readonly string[], attrs: () => XmlAttributes): void {
		const value = this.select(name, path, attrs);
		if (value !== undefined) {
			this.entries.push({ value, depth: path.length });
		}
	}

	close(_name: string, path: readonly string[]): void {
		const top = this.entries[this.entries.length - 1];
		if (top && top.depth === path.length) {
			this.entries.pop();
		}
	}

	/** innermost first; depth = path.length when the element opened */
	nearest(match: (value: T, depth: number) => boolean): { value: T; depth: number } | undefined {
		for (let i = this.entries.length - 1; i >= 0; i--) {
			const entry = this.entries[i];
			if (match(entry.value, entry.depth)) {
				return { value: entry.value, depth: entry.depth };
			}
		}
		return undefined;
	}
}
