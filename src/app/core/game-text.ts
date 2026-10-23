import { LocalStorage } from './services/local-storage';

export interface GameLanguage {
	code: string;
	name: string;
	/** file name under assets/flags */
	flag: string;
}

/** Languages of the game texts (names, descriptions) exported by the extractor to assets/i18n/<language>. */
export const GAME_LANGUAGES: readonly GameLanguage[] = [
	{ code: 'en', name: 'English', flag: 'gb' },
	{ code: 'cs', name: 'Čeština', flag: 'cz' },
	{ code: 'de', name: 'Deutsch', flag: 'de' },
	{ code: 'es', name: 'Español', flag: 'es' },
	{ code: 'fr', name: 'Français', flag: 'fr' },
	{ code: 'it', name: 'Italiano', flag: 'it' },
	{ code: 'pl', name: 'Polski', flag: 'pl' },
	{ code: 'pt-BR', name: 'Português (Brasil)', flag: 'br' },
	{ code: 'tr', name: 'Türkçe', flag: 'tr' },
	{ code: 'ja', name: '日本語', flag: 'jp' },
	{ code: 'ko', name: '한국어', flag: 'kr' },
	{ code: 'zh-Hans', name: '简体中文', flag: 'cn' },
	{ code: 'zh-Hant', name: '繁體中文', flag: 'tw' },
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
	/** Texts of the selected language by hash of the English text, from every texts file loaded so far. */
	private static texts: Record<string, string> | null = null;
	private static readonly files = new Map<string, Promise<void>>();
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

	/** Replaces the loaded texts, for tests. */
	static setTexts(value: Record<string, string> | null) {
		GameText.texts = value;
		GameText.files.clear();
	}

	/**
	 * Starts fetching the texts of data files of the selected language, so the data files of a lazy route
	 * find them in flight instead of fetching one after another while they evaluate.
	 */
	static preload(files: readonly string[]): Promise<void> {
		return Promise.all(files.map((file) => GameText.loadFile(file))).then(() => undefined);
	}

	/** Loads a lazy route along with the texts of the data files it uses. */
	static withTexts<T>(files: readonly string[], load: () => Promise<T>): Promise<T> {
		return Promise.all([GameText.preload(files), load()]).then(([, loaded]) => loaded);
	}

	/** The selected language's text of an English game text, looked up in the texts loaded so far. */
	static get(value: string): string {
		return GameText.texts?.[GameText.hash(value.trim())] ?? value;
	}

	/**
	 * Swaps the English game texts of generated data for the selected language, in place, so every
	 * object referencing the data sees them. Awaited by each data file when it loads, with the name of
	 * its texts file under assets/i18n/<language>.
	 */
	static async translate(data: object, file: string): Promise<void> {
		await GameText.loadFile(file);
		if (GameText.texts) {
			GameText.walk(data);
		}
	}

	/** Swaps every value of a record of English game texts, e.g. descriptions by id. */
	static async translateRecord(data: Record<string, string>, file: string): Promise<void> {
		await GameText.loadFile(file);
		if (GameText.texts) {
			for (const [key, value] of Object.entries(data)) {
				data[key] = GameText.get(value);
			}
		}
	}

	/** Fetches a texts file of the selected language once; a failed fetch keeps the English texts. */
	private static loadFile(file: string): Promise<void> {
		const language = GameText.language();
		if (language === 'en') {
			return Promise.resolve();
		}

		let loading = GameText.files.get(file);
		if (!loading) {
			loading = GameText.fetchFile(language, file);
			GameText.files.set(file, loading);
		}
		return loading;
	}

	private static async fetchFile(language: string, file: string) {
		try {
			const response = await fetch(new URL(`assets/i18n/${language}/${file}.json`, document.baseURI));
			if (response.ok) {
				const texts: Record<string, string> = await response.json();
				GameText.texts = { ...GameText.texts, ...texts };
			}
		} catch {
			// keep the English texts
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
