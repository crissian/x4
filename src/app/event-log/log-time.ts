import { Duration } from '../core/format/duration';

/** Logbook times as text: how long before the save, and the play time when it happened. */
export class LogTime {
	/** "2h 5m ago", "just now" under a second. */
	static ago(seconds: number): string {
		return seconds < 1 ? $localize`:log time:just now` : $localize`:log time:${Duration.short(seconds)}:duration: ago`;
	}

	/** The play time of the entry, such as "315h 53m". */
	static at(time: number): string {
		return Duration.hoursMinutes(time);
	}
}
