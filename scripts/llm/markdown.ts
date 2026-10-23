/** A value worth a line: skips missing values and empty lists so pages only show what the data has. */
export type Fact = [label: string, value: string | number | boolean | null | undefined];

/** Builds one markdown document line by line. */
export class Markdown {
	private readonly lines: string[] = [];

	static link(text: string, url: string): string {
		return `[${Markdown.escape(text)}](${url})`;
	}

	static num(value: number | undefined | null, digits = 2): string {
		return value == null ? '' : value.toLocaleString('en-US', { maximumFractionDigits: digits });
	}

	static value(value: string | number | boolean): string {
		return typeof value === 'number'
			? Markdown.num(value)
			: typeof value === 'boolean'
				? value
					? 'yes'
					: 'no'
				: value;
	}

	static escape(text: string): string {
		return text.replace(/([[\]|])/g, '\\$1').replace(/\r?\n/g, ' ');
	}

	h1(text: string): this {
		return this.block(`# ${text}`);
	}

	h2(text: string): this {
		return this.block(`## ${text}`);
	}

	p(text: string | undefined): this {
		return text ? this.block(text) : this;
	}

	facts(facts: Fact[]): this {
		const lines = facts
			.filter((fact): fact is [string, string | number | boolean] => fact[1] != null && fact[1] !== '')
			.map(([label, value]) => `- ${label}: ${Markdown.value(value)}`);
		return lines.length ? this.block(lines.join('\n')) : this;
	}

	list(items: string[]): this {
		return items.length ? this.block(items.map((item) => `- ${item}`).join('\n')) : this;
	}

	/** A section that only appears when it has items. */
	section(title: string, items: string[]): this {
		return items.length ? this.h2(title).list(items) : this;
	}

	/** A titled table that only appears when it has rows. */
	tableSection(title: string, headers: string[], rows: (string | number | undefined)[][]): this {
		return rows.length ? this.h2(title).table(headers, rows) : this;
	}

	table(headers: string[], rows: (string | number | undefined)[][]): this {
		if (!rows.length) {
			return this;
		}
		const cell = (value: string | number | undefined) =>
			value == null ? '' : typeof value === 'number' ? Markdown.num(value) : value;
		return this.block(
			[
				`| ${headers.join(' | ')} |`,
				`|${headers.map(() => ' --- |').join('')}`,
				...rows.map((row) => `| ${row.map(cell).join(' | ')} |`),
			].join('\n')
		);
	}

	toString(): string {
		return this.lines.join('\n\n') + '\n';
	}

	private block(text: string): this {
		this.lines.push(text);
		return this;
	}
}
