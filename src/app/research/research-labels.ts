import type { Tone } from '../shared/components/tone-dot/tone-dot.component';
import type { ResearchState, ResearchUnlockKind } from './research-model';

/** Display texts and colours of the research states and unlock kinds. */
export class ResearchLabels {
	static readonly TONES: Record<ResearchState, Tone> = {
		done: 'green',
		available: 'teal',
		locked: 'grey',
		mission: 'amber',
		story: 'orange',
	};

	private static readonly ROUTES: Partial<Record<ResearchUnlockKind, string>> = {
		module: '/modules',
		ship: '/ships',
		equipment: '/equipment',
	};

	private static states?: Record<ResearchState, string>;
	private static kinds?: Record<ResearchUnlockKind, string>;

	static state(state: ResearchState): string {
		ResearchLabels.states ??= {
			done: $localize`:research state:Done`,
			available: $localize`:research state:Available`,
			locked: $localize`:research state:Locked`,
			mission: $localize`:research state:From a mission`,
			story: $localize`:research state:From the story`,
		};
		return ResearchLabels.states[state];
	}

	static kind(kind: ResearchUnlockKind): string {
		ResearchLabels.kinds ??= {
			module: $localize`:research unlock kind:Station modules`,
			ship: $localize`:research unlock kind:Ships`,
			equipment: $localize`:research unlock kind:Equipment`,
			mod: $localize`:research unlock kind:Equipment mods`,
			ware: $localize`:research unlock kind:Wares`,
		};
		return ResearchLabels.kinds[kind];
	}

	/** The detail route of an unlock kind; mods and other wares have none. */
	static route(kind: ResearchUnlockKind): string | undefined {
		return ResearchLabels.ROUTES[kind];
	}
}
