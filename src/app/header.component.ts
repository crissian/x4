import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-header',
	imports: [RouterLink, RouterLinkActive],
	templateUrl: './header.component.html',
})
export class HeaderComponent {
	readonly links = [
		{ path: '/station-calculator', label: 'Station Calculator' },
		{ path: '/wares', label: 'Wares' },
		{ path: '/modules', label: 'Station Modules' },
		{ path: '/ships', label: 'Ships' },
		{ path: '/equipment', label: 'Equipment' },
		{ path: '/races', label: 'Races' },
		{ path: '/factions', label: 'Factions' },
		{ path: '/about', label: 'About' },
	];
}
