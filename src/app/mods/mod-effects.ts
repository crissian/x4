import { NumberFormats } from '../core/format/number-formats';
import type { ModBonus, ModEffect, ModStat, ModStatKind } from '../shared/services/model/equipment-mod';

/** Whether an effect helps, hurts, or can do either across its range. */
export type EffectTone = 'good' | 'bad' | 'mixed';

/**
 * Readable texts of equipment mod effects: "+5% to +20%", "+1 to +4", "+60% to +90%". Like the game's mod menu
 * (text {1001,8041}), every value is signed.
 */
export class ModEffects {
	private static readonly SIGNED_PERCENT: Intl.NumberFormatOptions = {
		style: 'percent',
		maximumFractionDigits: 1,
		signDisplay: 'exceptZero',
	};
	private static readonly PERCENT: Intl.NumberFormatOptions = { style: 'percent', maximumFractionDigits: 1 };

	/** The change a value makes, in the unit it is shown in: a ratio for percentages, else units. */
	static change(kind: ModStatKind, value: number): number {
		return kind === 'factor' ? value - 1 : value;
	}

	/** One value as shown: +15% for a factor of 1.15, +2 for an added 2, +60% for a fraction of 0.6. */
	static value(kind: ModStatKind, value: number): string {
		switch (kind) {
			case 'factor':
				return NumberFormats.format(ModEffects.change(kind, value), ModEffects.SIGNED_PERCENT);
			case 'add':
				return NumberFormats.signedWhole(value);
			case 'fraction':
				return NumberFormats.format(value, ModEffects.SIGNED_PERCENT);
		}
	}

	/** The range an effect rolls in, lowest first; a single value when it always rolls the same. */
	static range(stat: ModStat | undefined, effect: Pick<ModEffect, 'min' | 'max'>): string {
		const kind = stat?.kind ?? 'factor';
		const low = Math.min(effect.min, effect.max);
		const high = Math.max(effect.min, effect.max);
		const from = ModEffects.value(kind, low);
		const to = ModEffects.value(kind, high);
		return from === to ? from : $localize`:mod effect range:${from}:from: to ${to}:to:`;
	}

	/** The effect with its stat: "Weapon Damage +5% to +20%". */
	static text(stat: ModStat | undefined, effect: Pick<ModEffect, 'stat' | 'min' | 'max'>): string {
		return `${stat?.name ?? effect.stat} ${ModEffects.range(stat, effect)}`;
	}

	/** Good when the whole range improves the stat, bad when it all worsens it, else mixed. */
	static tone(stat: ModStat | undefined, effect: Pick<ModEffect, 'min' | 'max'>): EffectTone {
		const kind = stat?.kind ?? 'factor';
		// a fraction of its own (damage reduction, concealment) is better as it grows unless the stat says otherwise
		const sign = stat?.lowerIsBetter ? -1 : 1;
		const low = sign * ModEffects.change(kind, effect.min);
		const high = sign * ModEffects.change(kind, effect.max);
		if (low >= 0 && high >= 0) {
			return 'good';
		}
		if (low <= 0 && high <= 0) {
			return 'bad';
		}
		return 'mixed';
	}

	/** The best value the effect can roll, as a change in the better direction: for sorting by strength. */
	static best(stat: ModStat | undefined, effect: Pick<ModEffect, 'min' | 'max'>): number {
		const kind = stat?.kind ?? 'factor';
		const sign = stat?.lowerIsBetter ? -1 : 1;
		return Math.max(sign * ModEffects.change(kind, effect.min), sign * ModEffects.change(kind, effect.max));
	}

	/**
	 * The game's own line for the bonus of a mod (ui/addons/ego_detailmonitor/menu_ship_configuration.lua,
	 * texts {1001,8039} and {1001,8040}): "Up to 1 more property", "Up to 3 more properties".
	 */
	static bonus(bonus: Pick<ModBonus, 'max'>): string {
		return bonus.max === 1
			? $localize`:mod bonus:Up to 1 more property`
			: $localize`:mod bonus:Up to ${bonus.max}:count: more properties`;
	}

	/**
	 * The chance of each number of bonus properties, as the game works it out for its tooltip: p^n * (1 - p) below the
	 * bonus max, p^max at it.
	 */
	static bonusChances(bonus: Pick<ModBonus, 'max' | 'chance'>): { count: number; chance: number }[] {
		return Array.from({ length: bonus.max }, (_, i) => {
			const count = i + 1;
			const rest = count === bonus.max ? 1 : 1 - bonus.chance;
			return { count, chance: bonus.chance ** count * rest };
		});
	}

	/** The game's tooltip of the bonus line: "Probabilities for additional properties:" and "+1 Properties: 25%". */
	static bonusTooltip(bonus: Pick<ModBonus, 'max' | 'chance'>): string {
		const lines = ModEffects.bonusChances(bonus).map(
			(x) =>
				`${NumberFormats.signedWhole(x.count)} ${$localize`:mod bonus:Properties`}: ${NumberFormats.format(x.chance, ModEffects.PERCENT)}`
		);
		return [$localize`:mod bonus:Probabilities for additional properties:`, ...lines].join('\n');
	}
}
