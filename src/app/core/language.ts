import { registerLocaleData } from '@angular/common';
import { loadTranslations } from '@angular/localize';
import { GameText } from './game-text';

// number and date formats of the languages; English is built in
const LOCALE_DATA: Record<string, () => Promise<{ default: unknown[] }>> = {
	cs: () => import('@angular/common/locales/cs'),
	de: () => import('@angular/common/locales/de'),
	es: () => import('@angular/common/locales/es'),
	fr: () => import('@angular/common/locales/fr'),
	it: () => import('@angular/common/locales/it'),
	ja: () => import('@angular/common/locales/ja'),
	ko: () => import('@angular/common/locales/ko'),
	pl: () => import('@angular/common/locales/pl'),
	'pt-BR': () => import('@angular/common/locales/pt'),
	tr: () => import('@angular/common/locales/tr'),
	'zh-Hans': () => import('@angular/common/locales/zh-Hans'),
	'zh-Hant': () => import('@angular/common/locales/zh-Hant'),
};

export class Language {
	/** The locale of the selected language, for LOCALE_ID. */
	static locale(): string {
		const language = GameText.language();
		return language === 'en' ? 'en-US' : language;
	}

	/**
	 * Loads the selected language: the game texts, the translations of the app texts and the number formats.
	 * Must finish before the app code loads, as `$localize` and the data files translate when they are evaluated.
	 */
	static async load(): Promise<void> {
		const language = GameText.language();
		if (language === 'en') {
			return;
		}

		await Promise.all([GameText.load(), Language.loadUiText(language), Language.loadLocaleData(language)]);
	}

	private static async loadUiText(language: string) {
		try {
			const response = await fetch(new URL(`assets/i18n/ui/messages.${language}.json`, document.baseURI));
			if (response.ok) {
				const messages: { translations: Record<string, string> } = await response.json();
				loadTranslations(messages.translations);
			}
		} catch {
			// keep the English texts
		}
	}

	private static async loadLocaleData(language: string) {
		const data = await LOCALE_DATA[language]?.();
		if (data) {
			registerLocaleData(data.default, language);
		}
	}
}
