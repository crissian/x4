/** The escapes of logbook texts in a save: `[\012]` line breaks, `[\033]#AARRGGBB#…[\033]X` colours, key names. */
export class LogText {
	/** Texts are cut after this many characters to keep the stored log small. */
	static readonly MAX_TEXT = 400;

	private static readonly COLOR = /\[\\033\]#[0-9A-Fa-f]{8}#|\[\\033\]X/g;
	private static readonly KEY = /\[\\033\]\[([^\]]*)\]/g;
	private static readonly NEWLINE = /\[\\012\]/g;

	/** Plain text with `\n` line breaks; key placeholders become the key name, e.g. `LSHIFT`. */
	static clean(value: string): string {
		return value
			.replace(LogText.COLOR, '')
			.replace(LogText.KEY, (_, key: string) => key.slice(key.lastIndexOf('_') + 1))
			.replace(LogText.NEWLINE, '\n')
			.trim();
	}

	/** The cleaned text, cut to `MAX_TEXT` characters with an ellipsis. */
	static short(value: string): string {
		const text = LogText.clean(value);
		return text.length > LogText.MAX_TEXT ? `${text.slice(0, LogText.MAX_TEXT - 1)}…` : text;
	}
}
