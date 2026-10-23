import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMap } from '@lucide/angular';
import type { Sector } from '../../shared/services/model/universe';

/** A sector's name linking to its page, and a map icon showing it on the galaxy map; else the fallback text. */
@Component({
	selector: 'app-sector-links',
	imports: [RouterLink, LucideMap],
	templateUrl: './sector-links.component.html',
})
export class SectorLinksComponent {
	readonly sector = input<Sector>();
	/** Shown without a sector, e.g. the location text of the log. */
	readonly fallback = input<string>();
}
