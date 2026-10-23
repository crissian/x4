import { NumberFormats } from './number-formats';

type DurationUnit = 'hour' | 'minute' | 'second';

/** Durations in seconds as text, with the unit names and abbreviations of the selected language. */
export class Duration {
	/** The two largest units, rounded to the second: "1h 2m", "2m 5s" or "42s". */
	static short(seconds: number): string {
		const total = Math.max(0, Math.round(seconds));
		const h = Math.floor(total / 3600);
		const m = Math.floor((total % 3600) / 60);
		const s = total % 60;
		if (h) {
			return Duration.join([Duration.narrow(h, 'hour'), Duration.narrow(m, 'minute')]);
		}
		return m
			? Duration.join([Duration.narrow(m, 'minute'), Duration.narrow(s, 'second')])
			: Duration.narrow(s, 'second');
	}

	/** Hours and whole minutes, such as "10h 52m"; for long times such as the play time of a save. */
	static hoursMinutes(seconds: number): string {
		const total = Math.max(0, Math.floor(seconds / 60));
		return Duration.join([Duration.narrow(Math.floor(total / 60), 'hour'), Duration.narrow(total % 60, 'minute')]);
	}

	/** Minutes and seconds in words, leaving out a zero part: "1 minute 30 seconds", "45 seconds". */
	static long(seconds: number): string {
		const minutes = Math.trunc(seconds / 60);
		const rest = seconds - minutes * 60;
		const parts: string[] = [];
		if (minutes > 0) {
			parts.push(Duration.unit(minutes, 'minute', 'long'));
		}
		if (rest > 0) {
			parts.push(Duration.unit(rest, 'second', 'long'));
		}
		return Duration.join(parts);
	}

	private static narrow(value: number, unit: DurationUnit): string {
		return Duration.unit(value, unit, 'narrow');
	}

	private static unit(value: number, unit: DurationUnit, unitDisplay: 'narrow' | 'long'): string {
		return NumberFormats.format(value, { style: 'unit', unit, unitDisplay });
	}

	private static join(parts: string[]): string {
		return parts.join(' ');
	}
}
