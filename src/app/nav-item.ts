import type { LucideIconInput } from '@lucide/angular';

export interface NavLink {
	path: string;
	label: string;
	icon: LucideIconInput;
}

/** A button that opens a dropdown of links; it counts as active while the route is inside one of them. */
export interface NavGroup {
	label: string;
	icon: LucideIconInput;
	links: NavLink[];
}

export type NavItem = NavLink | NavGroup;

export class NavItems {
	static isGroup(item: NavItem): item is NavGroup {
		return 'links' in item;
	}

	static isLink(item: NavItem): item is NavLink {
		return !('links' in item);
	}
}
