import { Language } from '../language';

type PluralCategory = 'one' | 'few' | 'many' | 'other';

/**
 * Jump counts for texts built in code, where `$localize` can't hold an ICU plural: the plural category of the
 * language picks one message per category, so every language can use its own forms (such as Czech and Polish).
 */
export class JumpTexts {
	private static rules?: Intl.PluralRules;

	/** "within 1 jump", "within 3 jumps": the area around a sector. */
	static within(count: number): string {
		switch (JumpTexts.category(count)) {
			case 'one':
				return $localize`:@@jumps.within.one:within ${count}:count: jump`;
			case 'few':
				return $localize`:@@jumps.within.few:within ${count}:count: jumps`;
			case 'many':
				return $localize`:@@jumps.within.many:within ${count}:count: jumps`;
			default:
				return $localize`:@@jumps.within.other:within ${count}:count: jumps`;
		}
	}

	/** "1 jump", "3 jumps": the distance of a sector. */
	static distance(count: number): string {
		switch (JumpTexts.category(count)) {
			case 'one':
				return $localize`:@@jumps.distance.one:${count}:count: jump`;
			case 'few':
				return $localize`:@@jumps.distance.few:${count}:count: jumps`;
			case 'many':
				return $localize`:@@jumps.distance.many:${count}:count: jumps`;
			default:
				return $localize`:@@jumps.distance.other:${count}:count: jumps`;
		}
	}

	/** "here" for the sector itself, else "1 jump", "3 jumps": how far a sector is from another. */
	static away(count: number): string {
		return count === 0 ? $localize`:@@jumps.here:here` : JumpTexts.distance(count);
	}

	/** The plural category of a count in the selected language; zero, two and the others count as `other`. */
	static category(count: number): PluralCategory {
		JumpTexts.rules ??= new Intl.PluralRules(Language.locale());
		const category = JumpTexts.rules.select(count);
		return category === 'one' || category === 'few' || category === 'many' ? category : 'other';
	}
}
