import type { LucideIconInput } from '@lucide/angular';

export interface NavLink {
	path: string;
	label: string;
	icon: LucideIconInput;
}

/** Links of a group under an optional small heading. */
export interface NavSection {
	label?: string;
	links: NavLink[];
}

/** A button that opens a dropdown of links; it counts as active while the route is inside one of them. */
export interface NavGroup {
	label: string;
	icon: LucideIconInput;
	/** the links, in sections with their own heading when there are several kinds */
	sections: NavSection[];
	/** a pill marks the group as experimental */
	experimental?: boolean;
}

export type NavItem = NavLink | NavGroup;

export class NavItems {
	static isGroup(item: NavItem): item is NavGroup {
		return 'sections' in item;
	}

	static isLink(item: NavItem): item is NavLink {
		return !('sections' in item);
	}

	/** Every link of a group, section after section. */
	static links(group: NavGroup): NavLink[] {
		return group.sections.flatMap((x) => x.links);
	}
}
