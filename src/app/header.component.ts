import { Component, effect, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
	LucideCalculator,
	LucideCoffee,
	LucideDynamicIcon,
	LucideFactory,
	LucideFlag,
	LucideHexagon,
	LucideInfo,
	LucideLanguages,
	LucideMap,
	LucideMoon,
	LucidePackage,
	LucideRocket,
	LucideSave,
	LucideSun,
	LucideUsers,
	LucideWrench,
} from '@lucide/angular';
import { GAME_LANGUAGES, getGameLanguage, setGameLanguage } from './core/game-text';
import { SavegameSelectorComponent } from './savegame/components/savegame-selector.component';
import { ThemeService } from './core/services/theme.service';

@Component({
	selector: 'app-header',
	imports: [RouterLink, RouterLinkActive, FormField, LucideDynamicIcon, LucideSun, LucideMoon, LucideCoffee, LucideLanguages, SavegameSelectorComponent],
	templateUrl: './header.component.html',
})
export class HeaderComponent {
	protected readonly theme = inject(ThemeService);

	protected readonly switchToLight = $localize`Switch to light theme`;
	protected readonly switchToDark = $localize`Switch to dark theme`;

	protected readonly languages = GAME_LANGUAGES;
	private readonly language = getGameLanguage();
	protected readonly languageForm = form(signal({ language: this.language }));

	constructor() {
		// the game texts are swapped when the data loads, so a new language reloads the page
		effect(() => {
			const language = this.languageForm.language().value();
			if (language !== this.language) {
				setGameLanguage(language);
			}
		});
	}

	readonly links = [
		{ path: '/station-calculator', label: $localize`Station Calculator`, icon: LucideCalculator },
		{ path: '/wares', label: $localize`Wares`, icon: LucidePackage },
		{ path: '/modules', label: $localize`Station Modules`, icon: LucideFactory },
		{ path: '/ships', label: $localize`Ships`, icon: LucideRocket },
		{ path: '/equipment', label: $localize`Equipment`, icon: LucideWrench },
		{ path: '/races', label: $localize`Races`, icon: LucideUsers },
		{ path: '/factions', label: $localize`Factions`, icon: LucideFlag },
		{ path: '/sectors', label: $localize`Sectors`, icon: LucideHexagon },
		{ path: '/map', label: $localize`Map`, icon: LucideMap },
		{ path: '/saves', label: $localize`Savegames`, icon: LucideSave },
		{ path: '/about', label: $localize`About`, icon: LucideInfo },
	];
}
