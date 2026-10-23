import { NumberFormats } from '../core/format/number-formats';
import type { ModBonus, ModEffect, ModStat, ModStatKind } from '../shared/services/model/equipment-mod';

/** Whether an effect helps, hurts, or can do either across its range; `none` when its values are not shown. */
export type EffectTone = 'good' | 'bad' | 'mixed' | 'none';

/**
 * Readable texts of equipment mod effects, worked out as the game's mod menu does (ui/addons/ego_detailmonitorhelper/
 * helper.lua, Helper.modPropertyEval2Float and Helper.modPropertyEval2UINT, texts {1001,8041} and {1001,8042}): the
 * change from the stat's base value, "+5.00% to +20.00%" for a factor and "+1 to +4" for added units.
 *
 * The game takes the base value from the engine, not the game data. Factors are shown against 1 and added units
 * against 0. The fraction stats (radar visibility, hazardous region damage reduction, cargo concealment) have no
 * base value to go by, so they are shown without numbers: their name and the game's description only.
 */
export class ModEffects {
	private static readonly SIGNED_PERCENT: Intl.NumberFormatOptions = {
		style: 'percent',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		signDisplay: 'exceptZero',
	};
	private static readonly PERCENT: Intl.NumberFormatOptions = { style: 'percent', maximumFractionDigits: 1 };

	/** Whether the effect's values are shown: false for the fraction stats, whose base value is not in the data. */
	static shown(stat: ModStat | undefined): boolean {
		return (stat?.kind ?? 'factor') !== 'fraction';
	}

	/** The change a value makes from the base value, in the unit it is shown in: a ratio for factors, else units. */
	static change(kind: ModStatKind, value: number): number {
		return kind === 'factor' ? value - 1 : value;
	}

	/** One value as shown: +15.00% for a factor of 1.15, +2 for an added 2; undefined for a fraction. */
	static value(kind: ModStatKind, value: number): string | undefined {
		switch (kind) {
			case 'factor':
				return NumberFormats.format(ModEffects.change(kind, value), ModEffects.SIGNED_PERCENT);
			case 'add':
				return NumberFormats.signedWhole(value);
			case 'fraction':
				return undefined;
		}
	}

	/**
	 * The range an effect rolls in, in the game's order: min to max, but max first when min is below max on a stat
	 * that is better lower. Empty when the values are not shown.
	 */
	static range(stat: ModStat | undefined, effect: Pick<ModEffect, 'min' | 'max'>): string {
		const kind = stat?.kind ?? 'factor';
		const positive = !stat?.lowerIsBetter;
		const minFirst = (positive && effect.min < effect.max) || effect.min > effect.max;
		const from = ModEffects.value(kind, minFirst ? effect.min : effect.max);
		const to = ModEffects.value(kind, minFirst ? effect.max : effect.min);
		return from === undefined || to === undefined ? '' : $localize`:mod effect range:${from}:from: to ${to}:to:`;
	}

	/** The effect with its stat: "Weapon Damage +5.00% to +20.00%"; the name alone when the values are not shown. */
	static text(stat: ModStat | undefined, effect: Pick<ModEffect, 'stat' | 'min' | 'max'>): string {
		const range = ModEffects.range(stat, effect);
		const name = stat?.name ?? effect.stat;
		return range ? `${name} ${range}` : name;
	}

	/** Good when the whole range improves the stat, bad when it all worsens it, else mixed; none when not shown. */
	static tone(stat: ModStat | undefined, effect: Pick<ModEffect, 'min' | 'max'>): EffectTone {
		if (!ModEffects.shown(stat)) {
			return 'none';
		}
		const kind = stat?.kind ?? 'factor';
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

	/** The best value the effect can roll, as a change in the better direction, for sorting; 0 when not shown. */
	static best(stat: ModStat | undefined, effect: Pick<ModEffect, 'min' | 'max'>): number {
		if (!ModEffects.shown(stat)) {
			return 0;
		}
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
