import { readStorage, writeStorage } from './services/local-storage';

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

const STORAGE_KEY = 'language';

/** Properties of the generated data that hold game texts. */
const TEXT_KEYS = new Set([
	'name',
	'description',
	'factoryName',
	'environment',
	'suns',
	'class',
	'geology',
	'atmosphere',
	'population',
	'settlements',
]);

let texts: Record<string, string> | null = null;
const translated = new WeakSet<object>();

export function getGameLanguage(): string {
	return readStorage(STORAGE_KEY, 'en', (value) =>
		GAME_LANGUAGES.some((x) => x.code === value) ? (value as string) : undefined
	);
}

/** Stores the language and reloads the page, as the texts are swapped when the data loads. */
export function setGameLanguage(code: string) {
	writeStorage(STORAGE_KEY, code === 'en' ? undefined : code);
	location.reload();
}

/** FNV-1a over the UTF-16 code units, in base 36. Matches Translator.Hash in the extractor. */
export function hashText(text: string): string {
	let hash = 0x811c9dc5;
	for (let i = 0; i < text.length; i++) {
		hash ^= text.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}
	return (hash >>> 0).toString(36);
}

export function setGameTexts(value: Record<string, string> | null) {
	texts = value;
}

/** Fetches the texts of the selected language. Must finish before the data files load. */
export async function loadGameText(): Promise<void> {
	const language = getGameLanguage();
	if (language === 'en') {
		return;
	}

	try {
		const response = await fetch(new URL(`assets/i18n/${language}.json`, document.baseURI));
		if (response.ok) {
			setGameTexts(await response.json());
			document.documentElement.lang = language;
		}
	} catch {
		// keep the English texts
	}
}

/** The selected language's text of an English game text, e.g. a placeholder description. */
export function gameText(value: string): string {
	return translateText(value);
}

function translateText(value: string): string {
	return texts?.[hashText(value.trim())] ?? value;
}

/**
 * Swaps the English game texts of generated data for the selected language, in place, so every
 * object referencing the data sees them. Called by each data file when it loads.
 */
export function translateGameText(data: object) {
	if (texts) {
		walk(data);
	}
}

function walk(value: object) {
	if (translated.has(value)) {
		return;
	}
	translated.add(value);

	if (Array.isArray(value)) {
		value.forEach((x) => isObject(x) && walk(x));
		return;
	}

	const item = value as Record<string, unknown>;
	for (const [key, child] of Object.entries(item)) {
		if (typeof child === 'string') {
			if (TEXT_KEYS.has(key)) {
				item[key] = translateText(child);
			}
		} else if (Array.isArray(child) && TEXT_KEYS.has(key)) {
			item[key] = child.map((x) => (typeof x === 'string' ? translateText(x) : x));
		} else if (isObject(child)) {
			walk(child);
		}
	}
}

function isObject(value: unknown): value is object {
	return typeof value === 'object' && value !== null;
}
