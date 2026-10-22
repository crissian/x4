export class MapLabel {
	/** Splits a long name over two lines. */
	static wrap(name: string): string[] {
		if (name.length <= 14) {
			return [name];
		}
		const middle = name.length / 2;
		let split = -1;
		for (let i = 0; i < name.length; i++) {
			if (name[i] === ' ' && (split < 0 || Math.abs(i - middle) < Math.abs(split - middle))) {
				split = i;
			}
		}
		return split < 0 ? [name] : [name.slice(0, split), name.slice(split + 1)];
	}
}
