import { LocalStorage } from './services/local-storage';

export interface GameLanguage {
	code: string;
	name: string;
}

/** Languages of the game texts (names, descriptions) exported by the extractor to assets/i18n. */
export const GAME_LANGUAGES: readonly GameLanguage[] = [
	{ code: 'en', name: 'English' },
	{ code: 'cs', name: 'Čeština' },
	{ code: 'de', name: 'Deutsch' },
	{ code: 'es', name: 'Español' },
	{ code: 'fr', name: 'Français' },
	{ code: 'it', name: 'Italiano' },
	{ code: 'pl', name: 'Polski' },
	{ code: 'pt-BR', name: 'Português (Brasil)' },
	{ code: 'tr', name: 'Türkçe' },
	{ code: 'ja', name: '日本語' },
	{ code: 'ko', name: '한국어' },
	{ code: 'zh-Hans', name: '简体中文' },
	{ code: 'zh-Hant', name: '繁體中文' },
];

/** Properties of the generated data that hold game texts. */
const TEXT_KEYS = new Set([
	'name',
	'description',
	'factoryName',
	'shortName',
	'environment',
	'suns',
	'class',
	'geology',
	'atmosphere',
	'population',
	'settlements',
]);

export class GameText {
	private static readonly STORAGE_KEY = 'language';
	private static texts: Record<string, string> | null = null;
	private static readonly translated = new WeakSet<object>();

	static language(): string {
		return LocalStorage.read(GameText.STORAGE_KEY, 'en', (value) =>
			GAME_LANGUAGES.some((x) => x.code === value) ? (value as string) : undefined
		);
	}

	/** Stores the language and reloads the page, as the texts are swapped when the data loads. */
	static setLanguage(code: string) {
		LocalStorage.write(GameText.STORAGE_KEY, code === 'en' ? undefined : code);
		location.reload();
	}

	/** FNV-1a over the UTF-16 code units, in base 36. Matches Translator.Hash in the extractor. */
	static hash(text: string): string {
		let hash = 0x811c9dc5;
		for (let i = 0; i < text.length; i++) {
			hash ^= text.charCodeAt(i);
			hash = Math.imul(hash, 0x01000193);
		}
		return (hash >>> 0).toString(36);
	}

	static setTexts(value: Record<string, string> | null) {
		GameText.texts = value;
	}

	/** Fetches the texts of the selected language. Must finish before the data files load. */
	static async load(): Promise<void> {
		const language = GameText.language();
		if (language === 'en') {
			return;
		}

		try {
			const response = await fetch(new URL(`assets/i18n/${language}.json`, document.baseURI));
			if (response.ok) {
				GameText.setTexts(await response.json());
				document.documentElement.lang = language;
			}
		} catch {
			// keep the English texts
		}
	}

	/** The selected language's text of an English game text, e.g. a placeholder description. */
	static get(value: string): string {
		return GameText.texts?.[GameText.hash(value.trim())] ?? value;
	}

	/**
	 * Swaps the English game texts of generated data for the selected language, in place, so every
	 * object referencing the data sees them. Called by each data file when it loads.
	 */
	static translate(data: object) {
		if (GameText.texts) {
			GameText.walk(data);
		}
	}

	private static walk(value: object) {
		if (GameText.translated.has(value)) {
			return;
		}
		GameText.translated.add(value);

		if (Array.isArray(value)) {
			value.forEach((x) => GameText.isObject(x) && GameText.walk(x));
			return;
		}

		const item = value as Record<string, unknown>;
		for (const [key, child] of Object.entries(item)) {
			if (typeof child === 'string') {
				if (TEXT_KEYS.has(key)) {
					item[key] = GameText.get(child);
				}
			} else if (Array.isArray(child) && TEXT_KEYS.has(key)) {
				item[key] = child.map((x) => (typeof x === 'string' ? GameText.get(x) : x));
			} else if (GameText.isObject(child)) {
				GameText.walk(child);
			}
		}
	}

	private static isObject(value: unknown): value is object {
		return typeof value === 'object' && value !== null;
	}
}
