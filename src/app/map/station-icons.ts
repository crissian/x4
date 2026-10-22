import {
	LucideAnchor,
	LucideArrowLeftRight,
	LucideCircle,
	LucideFactory,
	LucideShield,
	LucideShip,
	LucideSkull,
	LucideWrench,
	type LucideIconInput,
} from '@lucide/angular';
import type { StationTypeInfo } from '../shared/services/constants';

/** The Lucide icons of the station types, by `StationTypeInfo.icon`; kept out of the constants so they stay lazy. */
export class StationIcons {
	private static readonly ICONS: Record<StationTypeInfo['icon'], LucideIconInput> = {
		anchor: LucideAnchor,
		ship: LucideShip,
		wrench: LucideWrench,
		'arrow-left-right': LucideArrowLeftRight,
		shield: LucideShield,
		skull: LucideSkull,
		factory: LucideFactory,
		circle: LucideCircle,
	};

	static of(type: StationTypeInfo): LucideIconInput {
		return StationIcons.ICONS[type.icon];
	}
}
