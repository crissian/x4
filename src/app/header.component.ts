import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
	selector: 'app-header',
	imports: [RouterLink, RouterLinkActive],
	templateUrl: './header.component.html',
})
export class HeaderComponent {
	protected readonly theme = inject(ThemeService);

	readonly links = [
		{ path: '/station-calculator', label: 'Station Calculator' },
		{ path: '/wares', label: 'Wares' },
		{ path: '/modules', label: 'Station Modules' },
		{ path: '/ships', label: 'Ships' },
		{ path: '/equipment', label: 'Equipment' },
		{ path: '/races', label: 'Races' },
		{ path: '/factions', label: 'Factions' },
		{ path: '/sectors', label: 'Sectors' },
		{ path: '/map', label: 'Map' },
		{ path: '/about', label: 'About' },
	];
}
