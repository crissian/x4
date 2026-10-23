import { Component } from '@angular/core';
import { LucideCoffee, LucideDynamicIcon, LucideHandHeart, LucideHeart, type LucideIconInput } from '@lucide/angular';

interface SupportLink {
	label: string;
	href: string;
	icon: LucideIconInput;
}

/** The header's support button: a native popover listing the donation pages, so outside clicks and Escape close it. */
@Component({
	selector: 'app-support-menu',
	imports: [LucideDynamicIcon, LucideHeart],
	templateUrl: './support-menu.component.html',
	host: { class: 'shrink-0' },
})
export class SupportMenuComponent {
	protected readonly links: SupportLink[] = [
		{ label: $localize`Buy me a coffee`, href: 'https://www.buymeacoffee.com/crissian', icon: LucideCoffee },
		{ label: 'Patreon', href: 'https://www.patreon.com/crissianx', icon: LucideHandHeart },
		{ label: 'GitHub Sponsors', href: 'https://github.com/sponsors/crissian', icon: LucideHeart },
	];
}
