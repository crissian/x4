import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
	LucideCalculator,
	LucideCoffee,
	LucideDynamicIcon,
	LucideFactory,
	LucideFlag,
	LucideHexagon,
	LucideInfo,
	LucideMap,
	LucideMoon,
	LucidePackage,
	LucideRocket,
	LucideSun,
	LucideUsers,
	LucideWrench,
} from '@lucide/angular';
import { ThemeService } from './core/services/theme.service';

@Component({
	selector: 'app-header',
	imports: [RouterLink, RouterLinkActive, LucideDynamicIcon, LucideSun, LucideMoon, LucideCoffee],
	templateUrl: './header.component.html',
})
export class HeaderComponent {
	protected readonly theme = inject(ThemeService);

	readonly links = [
		{ path: '/station-calculator', label: 'Station Calculator', icon: LucideCalculator },
		{ path: '/wares', label: 'Wares', icon: LucidePackage },
		{ path: '/modules', label: 'Station Modules', icon: LucideFactory },
		{ path: '/ships', label: 'Ships', icon: LucideRocket },
		{ path: '/equipment', label: 'Equipment', icon: LucideWrench },
		{ path: '/races', label: 'Races', icon: LucideUsers },
		{ path: '/factions', label: 'Factions', icon: LucideFlag },
		{ path: '/sectors', label: 'Sectors', icon: LucideHexagon },
		{ path: '/map', label: 'Map', icon: LucideMap },
		{ path: '/about', label: 'About', icon: LucideInfo },
	];
}
