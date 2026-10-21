import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

/** localStorage key of the theme picked with the switch; also read by the inline script in index.html */
const STORAGE_KEY = 'theme';

function readStoredTheme(): Theme | null {
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		return value === 'light' || value === 'dark' ? value : null;
	} catch {
		return null;
	}
}

function storeTheme(theme: Theme | null) {
	try {
		if (theme) {
			localStorage.setItem(STORAGE_KEY, theme);
		} else {
			localStorage.removeItem(STORAGE_KEY);
		}
	} catch {
		// storage unavailable (private mode, blocked site data): the choice lasts for this visit only
	}
}

/**
 * Light / dark theme. Follows the system theme until the user picks one with the switch.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
	private readonly document = inject(DOCUMENT);
	private readonly media = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');

	private readonly systemTheme = signal<Theme>(this.media?.matches ? 'dark' : 'light');
	/** theme picked with the switch, null to follow the system theme */
	private readonly preference = signal<Theme | null>(readStoredTheme());

	readonly theme = computed(() => this.preference() ?? this.systemTheme());
	readonly isDark = computed(() => this.theme() === 'dark');

	constructor() {
		this.media?.addEventListener('change', (event) => this.systemTheme.set(event.matches ? 'dark' : 'light'));

		effect(() => {
			this.document.documentElement.classList.toggle('dark', this.isDark());
		});
	}

	toggle() {
		const theme: Theme = this.isDark() ? 'light' : 'dark';
		// picking the system theme goes back to following the system
		const preference = theme === this.systemTheme() ? null : theme;
		this.preference.set(preference);
		storeTheme(preference);
	}
}
