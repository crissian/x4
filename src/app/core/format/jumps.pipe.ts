import { Pipe, PipeTransform } from '@angular/core';
import { JumpTexts } from './jump-texts';

/** The form of a jump count: "3 jumps", "within 3 jumps", or "here" for no jump at all. */
export type JumpsForm = 'distance' | 'within' | 'away';

/** A jump count with the plural forms of the selected language: `{{ route.jumps | jumps }}` gives "1 jump". */
@Pipe({ name: 'jumps' })
export class JumpsPipe implements PipeTransform {
	transform(count: number | null | undefined, form: JumpsForm = 'distance'): string {
		if (count == null) {
			return '';
		}
		switch (form) {
			case 'within':
				return JumpTexts.within(count);
			case 'away':
				return JumpTexts.away(count);
			default:
				return JumpTexts.distance(count);
		}
	}
}
