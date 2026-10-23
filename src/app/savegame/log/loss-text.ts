/** What the title and text of a "destroyed" logbook entry tell. */
export interface LossParts {
	name: string;
	code: string;
	location?: string;
	killer?: string;
	killerCode?: string;
	commander?: string;
}

/** A name with its id code, as the logbook writes objects: `Mercury Vanguard (HKI-952)`. */
interface NamedObject {
	name: string;
	code?: string;
}

/**
 * Reads the logbook entry the game writes when a player-owned object is destroyed (md/notifications.xml,
 * PlayerOwnedKilled): the title is `<name> (<code>) was destroyed.`, the text has one line each for the location,
 * the commander (optional) and the killer (optional), each `<label>: <value>` in the language the game ran in.
 */
export class LossText {
	/** The "Destroyed by" label of each game language (t-files page 1016, id 36). */
	private static readonly KILLER_LABELS = [
		'Destroyed by',
		'Zerstört von',
		'Détruit par',
		'Détruite par',
		'Destruida por',
		'Destruído por',
		'Distrutto da',
		'Zničen',
		'Zniszczony przez',
		'Уничтожен',
		'破壊した施設/艦船',
		'다음에 의해 파괴됨',
		'被此目标摧毁',
		'被摧毀，兇手',
	];
	private static readonly OBJECT = /^(.*?)\s*\(([A-Z]{3}-\d{3})\)/;
	private static readonly SEPARATOR = /^[\s:：]+/;

	/** The parts of a cleaned title and text; undefined when the title has no name and id code. */
	static parse(title: string, text: string | undefined): LossParts | undefined {
		const killed = LossText.object(title);
		if (!killed?.code) {
			return undefined;
		}
		const result: LossParts = { name: killed.name, code: killed.code };
		const lines = (text ?? '').split('\n').map((x) => x.trim());
		const location = lines[0] ? LossText.value(lines[0]) : '';
		if (location) {
			result.location = location;
		}
		const rest = lines.slice(1).filter((x) => x);
		rest.forEach((line, i) => {
			const label = LossText.KILLER_LABELS.find((x) => line.startsWith(x));
			// without a known label, a third line is the killer and a second one the commander
			if (label || (!rest.some((x) => LossText.isKiller(x)) && rest.length === 2 && i === 1)) {
				const killer = LossText.object(LossText.value(line, label));
				result.killer = killer.name;
				if (killer.code) {
					result.killerCode = killer.code;
				}
			} else {
				result.commander = LossText.object(LossText.value(line)).name;
			}
		});
		return result;
	}

	private static isKiller(line: string): boolean {
		return LossText.KILLER_LABELS.some((x) => line.startsWith(x));
	}

	/** The value after the label: after the known label, else after the first colon. */
	private static value(line: string, label?: string): string {
		if (label) {
			return line.slice(label.length).replace(LossText.SEPARATOR, '').trim();
		}
		const colon = line.search(/[:：]/);
		return colon < 0 ? line : line.slice(colon + 1).trim();
	}

	private static object(value: string): NamedObject {
		const match = LossText.OBJECT.exec(value);
		return match ? { name: match[1].trim(), code: match[2] } : { name: value.trim() };
	}
}
